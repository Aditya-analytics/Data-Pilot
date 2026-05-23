import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


#remove duplicates
def remove_duplicates(df,subset=None,keep="first"):
   df= df.drop_duplicates(
     subset=subset,
     keep=keep
   )
   return df

def fill_missing_values(df,columns,method="mean"):
    for col in columns:
        if method=="mean":
            value = df[col].mean()
            df[col]=df[col].fillna(value)

        if method=="median":
            value = df[col].median()
            df[col]=df[col].fillna(value)

        if method=="mode":
            value = df[col].mode()
            df[col]=df[col].fillna(value)

    return df
   
# columns normalization
# 1.remove extra space
# 2.convert to lowercase
# 3.replace space with underscore
# 4.remove specific character

def normalize_columns(df):
    df.columns=(df.columns.str.strip() #space remove 
                .str.lower()
                .str.replace(" ","_")
                .str.replace(r"[^\w]","",regex=True)
               )
    return df


# Datatype conversion

def convert_datatypes(df,columns,target_type):
    for col in columns:
        try:
            if target_type =="int":
                df[col]=pd.to_numeric(df[col],
                                      errors="coerce").astype("int64")
            elif target_type =="float":
                df[col]=pd.to_numeric(df[col],
                                      errors="coerce").astype("float")
            elif target_type =="string":
                df[col].astype("str")

            elif target_type =="datetime":
                df[col]=pd.to_numeric(df[col],
                                      errors="coerce")

        except Exception as e:
            print(f"Error converting {col}:{e}")
        return df
    

#standardisation
def standardize_data(df,columns):
    #extra space remove 
    # convert text into lowercase
    for col in columns:
        df[col]=(df[col].astype(str)
                 .str.lower()
                )
        return df
    

def custom_transformation(df,column,operation):
    if operation == "uppercase":
        df[column] =(df[column]
                     .astype(str)
                     .str.upper()
                    )

    elif operation == "uppercase":
        df[column] =(df[column]
                     .astype(str)
                     .str.lower()
                    )

    elif operation == "multiply_by_10":
        df[column] = df[column]*10

    elif operation == "add_prefix":
        df[column]="EMP_" + df[column].astype(str)

    elif operation == "add_suffix":
        df[column]=df[column].astype(str)+"_IND"

    return df
        
