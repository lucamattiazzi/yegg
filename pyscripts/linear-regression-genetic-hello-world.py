from sklearn import linear_model
from sklearn.preprocessing import PolynomialFeatures
from pdb import set_trace as shtap
import json

ind_vars = ["goalLength", "seedNumber", "survivalRate", "mutationRate"]
dep_vars = ["mean", "goalDistance", "stdev", "median"]

results = {}

def replace_var(coeff):
  coeffs = coeff.replace("x0", ind_vars[0]).replace("x1", ind_vars[1]).replace("x2", ind_vars[2]).replace("x3", ind_vars[3])
  return coeffs.split(" ")

with open('./hello-world-results-160k.json', 'r') as input:
  data = json.load(input)

independent_vars = [[val[var] for var in ind_vars] for val in data]

for dep_var in dep_vars:
  curr_results = {}
  vals = [val[dep_var] for val in data]
  poly = PolynomialFeatures(3)
  poly_matrix = poly.fit_transform(independent_vars)
  reg = linear_model.LinearRegression(normalize=False)
  reg.fit(poly_matrix, vals)
  curr_results["score"] = reg.score(poly_matrix, vals)
  all_variable_permutations = poly.get_feature_names()
  corrected_coeffs = []
  for idx, coefficient in enumerate(reg.coef_):
    variable = all_variable_permutations[idx]
    clean_variable = replace_var(variable)
    corrected_coeffs.append({ "variable": clean_variable, "coefficient": coefficient })
  curr_results["coefficients"] = corrected_coeffs
  results[dep_var] = curr_results

with open('./multi-poly-coefficients.json', 'w') as file:
  stringified = json.dumps(results, indent=2)
  file.write(stringified)
