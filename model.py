import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load dataset
df = pd.read_csv("heart_disease_data.csv")
X = df.drop(columns=["target"]).values  # Convert to NumPy for efficiency
y = df["target"].values

# Standardize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Function to calculate Gini Impurity
def gini_impurity(y):
    classes, counts = np.unique(y, return_counts=True)
    probabilities = counts / counts.sum()
    return 1 - np.sum(probabilities ** 2)

# Function to split dataset
def split_data(X, y, feature_index, threshold):
    left_mask = X[:, feature_index] <= threshold
    right_mask = ~left_mask
    return X[left_mask], y[left_mask], X[right_mask], y[right_mask]

# Find best split for Decision Tree
def best_split(X, y):
    best_gini, best_feature, best_threshold = float("inf"), None, None
    
    for feature_index in range(X.shape[1]):
        thresholds = np.unique(X[:, feature_index])
        for threshold in thresholds:
            X_left, y_left, X_right, y_right = split_data(X, y, feature_index, threshold)
            if len(y_left) == 0 or len(y_right) == 0:
                continue
            gini = (len(y_left) / len(y) * gini_impurity(y_left)) + (len(y_right) / len(y) * gini_impurity(y_right))
            if gini < best_gini:
                best_gini, best_feature, best_threshold = gini, feature_index, threshold
    
    return best_feature, best_threshold

# Decision Tree Node
class Node:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

# Build Decision Tree
def build_tree(X, y, depth=0, max_depth=10):
    if len(set(y)) == 1 or depth >= max_depth:
        return Node(value=max(set(y), key=list(y).count))  # Leaf Node
    
    feature, threshold = best_split(X, y)
    if feature is None:
        return Node(value=max(set(y), key=list(y).count))
    
    X_left, y_left, X_right, y_right = split_data(X, y, feature, threshold)
    return Node(
        feature=feature, threshold=threshold,
        left=build_tree(X_left, y_left, depth + 1, max_depth),
        right=build_tree(X_right, y_right, depth + 1, max_depth)
    )

# Predict using a Decision Tree
def predict_tree(node, x):
    if node.value is not None:
        return node.value
    return predict_tree(node.left, x) if x[node.feature] <= node.threshold else predict_tree(node.right, x)

# Random Forest Classifier (Manual)
class RandomForest:
    def __init__(self, n_trees=10, max_depth=10):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.trees = []

    def fit(self, X, y):
        self.trees = []
        for _ in range(self.n_trees):
            sample_indices = np.random.choice(len(X), len(X), replace=True)
            X_sample, y_sample = X[sample_indices], y[sample_indices]
            tree = build_tree(X_sample, y_sample, max_depth=self.max_depth)
            self.trees.append(tree)

    def predict(self, X):
        predictions = np.array([[predict_tree(tree, x) for tree in self.trees] for x in X])
        return np.array([np.bincount(pred).argmax() for pred in predictions])  # Majority voting

    def predict_proba(self, X):
        predictions = np.array([[predict_tree(tree, x) for tree in self.trees] for x in X])
        return np.array([np.bincount(pred, minlength=2) / self.n_trees for pred in predictions])  # Class probabilities

# Train model only once
kf = StratifiedKFold(n_splits=4, shuffle=True, random_state=42)
fold_accuracies = []

for train_idx, test_idx in kf.split(X_scaled, y):
    X_train, X_test = X_scaled[train_idx], X_scaled[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    
    model = RandomForest(n_trees=10, max_depth=10)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = np.mean(y_pred == y_test)
    fold_accuracies.append(accuracy)

print(f"K-Fold Accuracies: {fold_accuracies}")
print(f"Mean Accuracy: {np.mean(fold_accuracies):.2f}")

# Train final model
model.fit(X_scaled, y)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if "features" not in data:
            return jsonify({"error": "Missing 'features' key"}), 400

        # Convert features to a numpy array
        features = np.array(data["features"], dtype=np.float64).reshape(1, -1)
        data_scaled = scaler.transform(features)
        probability = model.predict_proba(data_scaled)[0][1]  # Probability of heart disease

        return jsonify({"heart_disease_risk": f"{probability * 100:.2f}%"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask API only when the script is executed directly
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)  # ✅ Disable debug mode to prevent double execution
    