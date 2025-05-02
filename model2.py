import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib.pyplot as plt

# Load dataset
from sklearn.model_selection import train_test_split

df = pd.read_csv("heart_disease_data.csv")
X = df.drop(columns=["target"]).values
y = df["target"].values

# Split into train-validation and hold-out test set
X_trainval, X_test, y_trainval, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

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
kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
fold_accuracies = []

for train_idx, val_idx in kf.split(X_trainval, y_trainval):
    # Scale within each fold to avoid leakage
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_trainval[train_idx])
    X_val = scaler.transform(X_trainval[val_idx])
    y_train = y_trainval[train_idx]
    y_val = y_trainval[val_idx]

    model = RandomForest(n_trees=10, max_depth=10)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_val)
    accuracy = np.mean(y_pred == y_val)
    fold_accuracies.append(accuracy)

print(f"K-Fold Accuracies: {fold_accuracies}")
print(f"Mean CV Accuracy: {np.mean(fold_accuracies):.2f}")

plt.figure(figsize=(6, 4))
plt.plot(range(1, len(fold_accuracies) + 1), fold_accuracies, 'b-o', linewidth=2)
plt.title('Cross-Validation Accuracy per Fold')
plt.xlabel('Fold')
plt.ylabel('Accuracy')
plt.ylim(0.7, 1.0)
plt.grid(True)

plt.tight_layout()
plt.savefig('model_performance.png', dpi=300, bbox_inches='tight')
plt.show()


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# API endpoint to predict heart disease risk
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        features = np.array(data["features"]).reshape(1, -1)
        data_scaled = scaler.transform(features)
        probability = model.predict_proba(data_scaled)[0][1]
        return jsonify({"heart_disease_risk": f"{probability * 100:.2f}%"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask API only when the script is executed directly
if __name__== "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)  # ✅ Disable debug mode to prevent double execution