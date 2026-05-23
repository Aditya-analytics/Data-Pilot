import pandas as pd
import numpy as np
import janitor
import os
from typing import List, Optional, Any
from pydantic import BaseModel

try:
    from sklearn.preprocessing import (
        StandardScaler,
        MinMaxScaler,
        LabelEncoder
    )
except ImportError:
    StandardScaler = Any
    MinMaxScaler = Any
    LabelEncoder = Any

class CleaningStep(BaseModel):
    tool_name: str
    action: str
    columns: Optional[List[str]] = None
    column: Optional[str] = None
    keep: Optional[str] = "first"
    subset: Optional[List[str]] = None

class CleaningPlan(BaseModel):
    steps: List[CleaningStep]

class PipelineExecutor:

    def execute_plan(self, dataset_id: str, plan: CleaningPlan):

        # LOAD DATASET
        df = pd.read_csv(
            f"backend/uploads/{dataset_id}.csv"
        )

        logs = []

        # =====================================================
        # EXECUTE EACH STEP
        # =====================================================

        for step in plan.steps:

            try:

                # =================================================
                # PANDAS TOOLS
                # =================================================

                if step.tool_name == "pandas":

                    # DROP DUPLICATES
                    if step.action == "drop_duplicates":

                        df = df.drop_duplicates(
                            subset=getattr(step, "columns", None),
                            keep=getattr(step, "keep", "first")
                        )

                        logs.append(
                            "Dropped duplicate rows."
                        )

                    # DROP NULL ROWS
                    elif step.action == "dropna":

                        df = df.dropna(
                            subset=step.columns
                        )

                        logs.append(
                            f"Dropped null rows from {step.columns}"
                        )

                    # IMPUTE MEAN
                    elif step.action == "impute_mean":

                        for col in step.columns:

                            value = df[col].mean()

                            df[col] = df[col].fillna(value)

                        logs.append(
                            f"Imputed mean for {step.columns}"
                        )

                    # IMPUTE MEDIAN
                    elif step.action == "impute_median":

                        for col in step.columns:

                            value = df[col].median()

                            df[col] = df[col].fillna(value)

                        logs.append(
                            f"Imputed median for {step.columns}"
                        )

                    # IMPUTE MODE
                    elif step.action == "impute_mode":

                        for col in step.columns:

                            modes = df[col].mode()
                            if not modes.empty:
                                value = modes[0]
                                df[col] = df[col].fillna(value)

                        logs.append(
                            f"Imputed mode for {step.columns}"
                        )

                    # DROP CORRELATED COLUMNS
                    elif step.action == "drop_correlated":

                        df = df.drop(
                            columns=step.columns
                        )

                        logs.append(
                            f"Dropped correlated columns {step.columns}"
                        )

                    # STANDARDIZE NULLS
                    elif step.action == "standardize_nulls":

                        null_values = [
                            "N/A",
                            "NULL",
                            "null",
                            "na",
                            ""
                        ]

                        df = df.replace(
                            null_values,
                            pd.NA
                        )

                        logs.append(
                            "Standardized null values."
                        )

                    # STRIP WHITESPACES
                    elif step.action == "strip_whitespace":

                        for col in step.columns:

                            df[col] = (
                                df[col]
                                .astype(str)
                                .str.strip()
                            )

                        logs.append(
                            f"Removed whitespaces from {step.columns}"
                        )

                    # LOWERCASE STRINGS
                    elif step.action == "lowercase_strings":

                        for col in step.columns:

                            df[col] = (
                                df[col]
                                .astype(str)
                                .str.lower()
                            )

                        logs.append(
                            f"Lowercased {step.columns}"
                        )

                    # CAST TO FLOAT
                    elif step.action == "cast_to_float":

                        for col in step.columns:

                            df[col] = (
                                df[col]
                                .replace(
                                    r'[^\d.-]',
                                    '',
                                    regex=True
                                )
                                .astype(float)
                            )

                        logs.append(
                            f"Converted {step.columns} to float"
                        )

                    # PARSE DATETIME
                    elif step.action == "parse_datetime":

                        for col in step.columns:

                            df[col] = pd.to_datetime(
                                df[col],
                                errors="coerce"
                            )

                        logs.append(
                            f"Parsed datetime for {step.columns}"
                        )

                    # EXTRACT DATETIME FEATURES
                    elif step.action == "extract_datetime_features":

                        for col in step.columns:

                            df[f'{col}_year'] = (
                                df[col].dt.year
                            )

                            df[f'{col}_month'] = (
                                df[col].dt.month
                            )

                            df[f'{col}_day'] = (
                                df[col].dt.day
                            )

                            df[f'{col}_dayofweek'] = (
                                df[col].dt.dayofweek
                            )

                        logs.append(
                            f"Extracted datetime features from {step.columns}"
                        )

                    # NULLIFY OUTLIERS
                    elif step.action == "nullify_outliers":

                        for col in step.columns:

                            q1 = df[col].quantile(0.25)
                            q3 = df[col].quantile(0.75)

                            iqr = q3 - q1

                            lower = q1 - 1.5 * iqr
                            upper = q3 + 1.5 * iqr

                            df[col] = df[col].mask(
                                (df[col] < lower) |
                                (df[col] > upper),
                                pd.NA
                            )

                        logs.append(
                            f"Nullified outliers in {step.columns}"
                        )

                    # VALIDATE EMAILS
                    elif step.action == "validate_emails":

                        for col in step.columns:

                            condition = ~df[col].str.contains(
                                r'^[\w\.-]+@[\w\.-]+\.\w+$',
                                regex=True,
                                na=False
                            )

                            df[col] = df[col].mask(
                                condition,
                                pd.NA
                            )

                        logs.append(
                            f"Validated emails in {step.columns}"
                        )

                # =================================================
                # SCIKIT-LEARN TOOLS
                # =================================================

                elif step.tool_name == "scikit-learn":

                    # STANDARD SCALING
                    if step.action == "standard_scale":

                        scaler = StandardScaler()

                        df[step.columns] = (
                            scaler.fit_transform(
                                df[step.columns]
                            )
                        )

                        logs.append(
                            f"Standard scaled {step.columns}"
                        )

                    # MINMAX SCALING
                    elif step.action == "minmax_scale":

                        scaler = MinMaxScaler()

                        df[step.columns] = (
                            scaler.fit_transform(
                                df[step.columns]
                            )
                        )

                        logs.append(
                            f"MinMax scaled {step.columns}"
                        )

                    # LABEL ENCODING
                    elif step.action == "label_encode":

                        for col in step.columns:

                            encoder = LabelEncoder()

                            df[col] = encoder.fit_transform(
                                df[col].astype(str)
                            )

                        logs.append(
                            f"Label encoded {step.columns}"
                        )

                    # ONE HOT ENCODING
                    elif step.action == "onehot_encode":

                        df = pd.get_dummies(
                            df,
                            columns=step.columns
                        )

                        logs.append(
                            f"One-hot encoded {step.columns}"
                        )

                # =================================================
                # PYJANITOR TOOLS
                # =================================================

                elif step.tool_name == "pyjanitor":

                    # CLEAN NAMES
                    if step.action == "clean_names":

                        df = df.clean_names()

                        logs.append(
                            "Cleaned column names."
                        )

                    # REMOVE EMPTY
                    elif step.action == "remove_empty":

                        df = df.remove_empty()

                        logs.append(
                            "Removed empty rows and columns."
                        )

                # =================================================
                # CUSTOM TRANSFORMATIONS
                # =================================================

                elif step.tool_name == "custom":

                    # UPPERCASE
                    if step.action == "uppercase":

                        df[step.column] = (
                            df[step.column]
                            .astype(str)
                            .str.upper()
                        )

                        logs.append(
                            f"Uppercased {step.column}"
                        )

                    # LOWERCASE
                    elif step.action == "lowercase":

                        df[step.column] = (
                            df[step.column]
                            .astype(str)
                            .str.lower()
                        )

                        logs.append(
                            f"Lowercased {step.column}"
                        )

                    # MULTIPLY BY 10
                    elif step.action == "multiply_by_10":

                        df[step.column] = (
                            df[step.column] * 10
                        )

                        logs.append(
                            f"Multiplied {step.column} by 10"
                        )

                    # ADD PREFIX
                    elif step.action == "add_prefix":

                        df[step.column] = (
                            "EMP_" +
                            df[step.column].astype(str)
                        )

                        logs.append(
                            f"Added prefix to {step.column}"
                        )

                    # ADD SUFFIX
                    elif step.action == "add_suffix":

                        df[step.column] = (
                            df[step.column]
                            .astype(str)
                            + "_IND"
                        )

                        logs.append(
                            f"Added suffix to {step.column}"
                        )

            except Exception as e:

                logs.append(
                    f"Failed to execute {step.action}: {str(e)}"
                )

        # =====================================================
        # SAVE CLEANED DATASET
        # =====================================================

        output_dir = "backend/uploads"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        output_path = (
            f"{output_dir}/{dataset_id}_cleaned.csv"
        )

        df.to_csv(
            output_path,
            index=False
        )

        return {
            "status": "success",
            "output_path": output_path,
            "logs": logs
        }