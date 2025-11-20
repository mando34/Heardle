from point_system import PointSystem

# testing on user with U_ID = 1
TEST_USER_ID = 1  

points = PointSystem("heardle.db")

print("===== POINT SYSTEM TEST =====")

# Get initial points
initial = points.get_points(TEST_USER_ID)
print(f"Initial points for user {TEST_USER_ID}: {initial}")

# Add points
print("\nAdding 5 points...")
new_total = points.add_points(TEST_USER_ID, 5)
print(f"New total after adding 5: {new_total}")

# Add no points
print("\nAdding 0 points...")
new_total = points.add_points(TEST_USER_ID, 0)
print(f"New total after adding 0: {new_total}")

# Add more points
print("\nAdding 12 more points...")
new_total = points.add_points(TEST_USER_ID, 12)
print(f"New total after adding 12: {new_total}")

# Get final points
final = points.get_points(TEST_USER_ID)
print(f"\nFinal points for user {TEST_USER_ID}: {final}")

print("\n===== TEST COMPLETE =====")