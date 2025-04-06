import pandas as pd
import random
import string
from faker import Faker

fake = Faker("fi_FI") # Finnish Faker instance

# Postal code to city map, this is not complete nor accurate, but for now it's enough
postal_city_map ={
    "00100": "Helsinki",
    "20100": "Turku",
    "33100": "Tampere",
    "90100": "Oulu",
    "15110": "Lahti",
    "04200": "Kerava",
    "05810": "Hyvinkää",
    "04300": "Tuusula",
    "80100": "Joensuu",
    "01600": "Vantaa",
}

# --- Corruption Functions ---

# Introduces a typo into the text by swapping two random characters if the text is longer than 2 characters
def introduce_typo(text: str) -> str:
    if len(text) < 3:
        return text
    i = random.randint(0, len(text)-2) # Random index to swap
    return text[:i] + text[i+1] + text[i] + text[i+2:] 

def remove_random_character(text: str) -> str: 
    if len(text) < 2:
        return text
    i = random.randint(0, len(text)-1)
    return text[:i] + text[i+1:]

# Apply multiple corruptions
def corrupt_text(text: str, corruption_funcs: list) -> str:
    for func in corruption_funcs:
        if random.random() < 0.5:
            text = func(text)
    return text

# --- Main Generator ---
def generate_dataset(n_rows: int) -> pd.DataFrame:
    data = []

    for _ in range(n_rows): 
        postal_code = random.choice(list(postal_city_map.keys()))
        city = postal_city_map[postal_code]
        street = fake.street_name() + " " + str(random.randint(1,200))
        name = fake.name()
        company = fake.company()

        # Corruption
        noisy_street = corrupt_text(street, [introduce_typo, remove_random_character])
        noisy_name = corrupt_text(name, [introduce_typo, remove_random_character])
        noisy_company = corrupt_text(company, [introduce_typo, remove_random_character])
        noisy_postal= corrupt_text(postal_code, [introduce_typo, remove_random_character])
        noisy_city = corrupt_text(city, [introduce_typo, remove_random_character])

        # Missing fields
        if random.random() < 0.1: #meaning 10% of the time
            noisy_street = None
        if random.random() < 0.15:
            noisy_name = None
        if random.random() < 0.2:
            noisy_company = None

        # Append both versons
        data.append({
            "clean_name": name,
            "clean_company": company,
            "clean_street": street,
            "clean_postal_code": postal_code,
            "clean_city": city,

            "noisy_name": noisy_name,
            "noisy_company": noisy_company,
            "noisy_street": noisy_street,
            "noisy_postal_code": noisy_postal,
            "noisy_city": noisy_city,
        })
    
    return pd.DataFrame(data)  # Fixed indentation - moved outside the loop
    
    # Main function
    
if __name__ == "__main__":
   rows = 1000 
   df = generate_dataset(rows)
   df.to_csv("synthetic_shipment_data.csv", index=False) 
   print(f"Synthetic dataset with {rows} rows has been saved to synthetic_shipment_data.csv")

            

