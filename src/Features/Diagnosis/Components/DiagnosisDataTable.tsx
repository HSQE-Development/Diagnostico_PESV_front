import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  setQuestionsGrouped,
  setUpdateArticulated,
  setUpdatePercentage,
} from "@/stores/features/diagnosisSlice";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import {
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
} from "@/interfaces/Diagnosis";
import {
  ConfigProvider,
  Segmented,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { COMPLIANCE_LEVEL } from "../utils/constants";

interface Props {
  companyId: number;
}
interface DataType extends DiagnosisQuestionsGroup {
  key: React.Key;
}

export default function DiagnosisDataTable({ companyId }: Props) {
  const dispatch = useAppDispatch();
  const { data: diagnosisQuestionsByCompany, refetch } =
    diagnosisService.useFindQuestionsByCompanysizeGroupedQuery({ companyId });
  useEffect(() => {
    refetch();
  }, [companyId]);

  useEffect(() => {
    if (diagnosisQuestionsByCompany) {
      // Agrupar preguntas por step
      dispatch(setQuestionsGrouped(diagnosisQuestionsByCompany));
    }
  }, [diagnosisQuestionsByCompany]);

  const questionsGrouped = useAppSelector(
    (state) => state.diagnosis.questionsGrouped
  );
  const diagnosisData = useAppSelector(
    (state) => state.diagnosis.diagnosisData
  );

  const [selectedOption, setSelectedOption] = useState<{
    [step: number]: number;
  }>({});
  const [questionOption, setQuestionOption] = useState<{
    [qId: number]: number;
  }>({});
  const [articuledOption, setArticuledOption] = useState<{
    [qId: number]: boolean;
  }>({});

  useEffect(() => {
    // Reenderizado por defecto
    if (questionsGrouped.length > 0) {
      questionsGrouped.forEach((group) => {
        group.questions.forEach((question) => {
          dispatch(
            setUpdatePercentage({
              questionId: question.id,
              companyId,
              compliance: COMPLIANCE_LEVEL.NO_CUMPLE,
            })
          );
          setQuestionOption((prev) => ({
            ...prev,
            [question.id]: COMPLIANCE_LEVEL.NO_CUMPLE,
          }));
          setArticuledOption((prev) => ({
            ...prev,
            [question.id]: true,
          }));
        });
        setSelectedOption((prev) => ({
          ...prev,
          [group.step]: COMPLIANCE_LEVEL.NO_CUMPLE,
        }));
      });
    }
  }, [questionsGrouped]);

  const handleComplianceChange = (value: number, questionId: number) => {
    dispatch(
      setUpdatePercentage({
        companyId,
        compliance: value,
        questionId,
      })
    );
    setQuestionOption((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleArticulatedChange = (value: boolean, questionId: number) => {
    dispatch(setUpdateArticulated({ questionId, isArticulated: value }));
    setArticuledOption((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleGeneralChange = (value: number, step: number) => {
    if (questionsGrouped.length > 0) {
      questionsGrouped.forEach((group) => {
        group.questions.forEach((question) => {
          if (question.requirement_detail.step === step) {
            dispatch(
              setUpdatePercentage({
                questionId: question.id,
                companyId,
                compliance: value,
              })
            );
            setQuestionOption((prev) => ({ ...prev, [question.id]: value }));
          }
        });
        setSelectedOption((prev) => ({ ...prev, [step]: value }));
      });
    }
  };
  const defaultColors = {
    itemActiveBg: "#007bff",
    itemColor: "#000",
    itemHoverBg: "#f0f0f0",
    itemHoverColor: "#333333",
    itemSelectedBg: "#ffffff",
    itemSelectedColor: "#fff",
    trackBg: "#f5f5f5",
  };
  const conditionalColors: any = {
    1: {
      itemActiveBg: "#28a745",
      itemColor: "#BABABA",
      itemSelectedBg: "#28a745",
      itemSelectedColor: "#fff",
    },
    2: {
      itemActiveBg: "#dc3545",
      itemColor: "#BABABA",
      itemSelectedBg: "#dc3545",
      itemSelectedColor: "#fff",
    },
    3: {
      itemActiveBg: "#ffc107",
      itemColor: "#BABABA",
      itemSelectedBg: "#ffc107",
      itemSelectedColor: "#fff",
    },
    4: {
      itemActiveBg: "#17a2b8",
      itemColor: "#BABABA",
      itemSelectedBg: "#17a2b8",
      itemSelectedColor: "#fff",
    },
    true: {
      itemActiveBg: "#17a2b8",
      itemColor: "#BABABA",
      itemSelectedBg: "#17a2b8",
      itemSelectedColor: "#fff",
    },
    false: {
      itemActiveBg: "#17a2b8",
      itemColor: "#BABABA",
      itemSelectedBg: "#000",
      itemSelectedColor: "#fff",
    },
  };

  const columns: TableColumnsType<DiagnosisQuestionsGroup> = [
    {
      title: "PASO PESV",
      dataIndex: "step",
      key: "step",
      render: (text: number) => (
        <span>
          <span className="font-extrabold">{text}</span>
        </span>
      ),
    },
    {
      title: "FASE",
      dataIndex: "cycle",
      key: "cycle",
    },
    {
      title: "Requerimiento",
      dataIndex: "requirement_name",
      key: "requirement_name",
    },
    {
      title: "Nivel de Cumplimiento",
      render: (_, record) => {
        const colors =
          conditionalColors[selectedOption[record.step]] || defaultColors;
        return (
          <ConfigProvider
            theme={{
              components: {
                Segmented: {
                  ...colors,
                },
              },
            }}
          >
            <Segmented
              key={record.step}
              size="middle"
              options={[
                {
                  label: "C",
                  value: COMPLIANCE_LEVEL.CUMPLE,
                },
                {
                  label: "NC",
                  value: COMPLIANCE_LEVEL.NO_CUMPLE,
                },
                {
                  label: "NA",
                  value: COMPLIANCE_LEVEL.NO_APLICA,
                },
                {
                  label: "CP",
                  value: COMPLIANCE_LEVEL.CUMPLE_PARCIALMENTE,
                  disabled: true,
                },
              ]}
              value={selectedOption[record.step]}
              defaultValue={COMPLIANCE_LEVEL.NO_CUMPLE}
              onChange={(value) => handleGeneralChange(value, record.step)}
            />
          </ConfigProvider>
        );
      },
    },
  ];

  const expandableConfig: TableProps<DiagnosisQuestionsGroup>["expandable"] = {
    expandedRowRender: (group) => (
      <Table<DiagnosisQuestions>
        columns={[
          {
            title: "Criterio de Verificación",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Variable Value",
            dataIndex: "variable_value",
            key: "variable_value",
            render: (text) => `${text}%`,
          },
          {
            title: "Nivel de Cumplimiento",
            render: (_, question) => {
              const compliance =
                diagnosisData.find((d) => d.question === question.id)
                  ?.compliance || COMPLIANCE_LEVEL.NO_CUMPLE;

              const colors =
                conditionalColors[questionOption[question.id]] || defaultColors;
              return (
                <ConfigProvider
                  theme={{
                    components: {
                      Segmented: {
                        ...colors,
                      },
                    },
                  }}
                >
                  <Segmented
                    key={question.id}
                    size="small"
                    options={[
                      {
                        label: "C",
                        value: COMPLIANCE_LEVEL.CUMPLE,
                      },
                      {
                        label: "NC",
                        value: COMPLIANCE_LEVEL.NO_CUMPLE,
                      },
                      {
                        label: "CP",
                        value: COMPLIANCE_LEVEL.CUMPLE_PARCIALMENTE,
                      },
                      {
                        label: "NA",
                        value: COMPLIANCE_LEVEL.NO_APLICA,
                      },
                    ]}
                    value={compliance}
                    defaultValue={COMPLIANCE_LEVEL.NO_CUMPLE}
                    onChange={(value) =>
                      handleComplianceChange(value, question.id)
                    }
                  />
                </ConfigProvider>
              );
            },
          },
          // {
          //   title: "Esta articulado?",
          //   render: (_, question, index) => {
          //     const articulated = diagnosisData.find(
          //       (d) => d.question === question.id
          //     )?.is_articuled;

          //     const colors =
          //       conditionalColors[articuledOption[question.id] as any] ||
          //       defaultColors;
          //     return index === group.questions.length - 1 ? (
          //       <ConfigProvider
          //         theme={{
          //           components: {
          //             Segmented: {
          //               ...colors,
          //             },
          //           },
          //         }}
          //       >
          //         <Segmented
          //           key={index}
          //           size="small"
          //           options={[
          //             {
          //               label: "SI",
          //               value: true,
          //             },
          //             {
          //               label: "NO",
          //               value: false,
          //             },
          //           ]}
          //           value={articulated}
          //           defaultValue={true}
          //           onChange={(value) =>
          //             handleArticulatedChange(value, question.id)
          //           }
          //         />
          //       </ConfigProvider>
          //     ) : null;
          //   },
          // },
        ]}
        dataSource={group.questions}
        pagination={false}
        rowKey="id"
        rowClassName={(_, index) =>
          index === group.questions.length - 1 ? "font-bold" : ""
        }
        rowHoverable={false}
      />
    ),
    rowExpandable: (record) => record.questions.length > 0,
  };

  const dataSource: DataType[] = questionsGrouped.map((group) => ({
    ...group,
    key: group.id,
  }));
  return (
    <Table<DiagnosisQuestionsGroup>
      columns={columns}
      dataSource={dataSource}
      pagination={false} // Desactiva la paginación si no la necesitas
      expandable={expandableConfig}
      rowClassName={() => "bg-slate-100"}
    />
  );
}
