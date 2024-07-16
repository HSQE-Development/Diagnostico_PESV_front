import {
  DiagnosisDTO,
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
} from "@/interfaces/Diagnosis";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  questions: [] as DiagnosisQuestions[],
  questionsGrouped: [] as DiagnosisQuestionsGroup[],
  percentageObtained: 0 as number,
  totalVariableValue: 0 as number,
  totalValueObtained: 0 as number,
  percentageCompleted: 0 as number,
  diagnosisData: [] as DiagnosisDTO[],
};

export const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<DiagnosisQuestions[]>) => {
      state.questions = action.payload;
    },
    setQuestionsGrouped: (
      state,
      action: PayloadAction<DiagnosisQuestionsGroup[]>
    ) => {
      state.questionsGrouped = action.payload;
      state.totalVariableValue = calculateTotalVariableValue(action.payload);
      state.totalValueObtained = 0; // Resetear el valor obtenido al actualizar el grupo de preguntas
      state.percentageCompleted = calculatePercentageCompleted(
        state.totalValueObtained,
        state.totalVariableValue
      );
    },
    setUpdatePercentage: (
      state,
      action: PayloadAction<{
        questionId: number;
        companyId: number;
        compliance: number;
      }>
    ) => {
      const { questionId, companyId, compliance } = action.payload;
      const question = findQuestionById(state.questionsGrouped, questionId);
      if (question) {
        const obtainedValue = calculateValueObtained(
          question.variable_value,
          compliance
        );
        const diagnosisIndex = state.diagnosisData.findIndex(
          (data) => data.question === questionId && data.company === companyId
        );

        if (diagnosisIndex >= 0) {
          state.diagnosisData[diagnosisIndex] = {
            ...state.diagnosisData[diagnosisIndex],
            compliance,
            obtained_value: obtainedValue,
          };
        } else {
          state.diagnosisData.push({
            question: questionId,
            company: companyId,
            compliance,
            obtained_value: obtainedValue,
            verify_document: "",
            observation: "",
          });
        }

        state.totalValueObtained = calculateTotalValueObtainedFromDiagnosisData(
          state.diagnosisData
        );
        state.percentageCompleted = calculatePercentageCompleted(
          state.totalValueObtained,
          state.totalVariableValue
        );
      }
    },
  },
});
const calculateTotalVariableValue = (
  questionsGrouped: DiagnosisQuestionsGroup[]
): number => {
  return questionsGrouped.reduce((total, group) => {
    return (
      total +
      group.questions.reduce((groupTotal, question) => {
        return groupTotal + question.variable_value;
      }, 0)
    );
  }, 0);
};

const calculateTotalValueObtainedFromDiagnosisData = (
  diagnosisData: DiagnosisDTO[]
): number => {
  return diagnosisData.reduce((total, data) => total + data.obtained_value, 0);
};

const calculateValueObtained = (
  variableValue: number,
  compliance: number
): number => {
  switch (compliance) {
    case 1:
    case 4:
      return variableValue;
    case 2:
      return 0;
    case 3:
      return variableValue / 2;
    default:
      return 0;
  }
};

const calculatePercentageCompleted = (
  totalValueObtained: number,
  totalVariableValue: number
): number => {
  if (totalVariableValue === 0) {
    return 0;
  }
  return Math.round((totalValueObtained / totalVariableValue) * 100);
};

const findQuestionById = (
  questionsGrouped: DiagnosisQuestionsGroup[],
  id: number
): DiagnosisQuestions | undefined => {
  for (let group of questionsGrouped) {
    const question = group.questions.find((q) => q.id === id);
    if (question) {
      return question;
    }
  }
  return undefined;
};

export const { setQuestions, setQuestionsGrouped, setUpdatePercentage } =
  diagnosisSlice.actions;

export default diagnosisSlice.reducer;
