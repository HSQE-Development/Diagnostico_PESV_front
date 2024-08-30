import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  setQuestionsGrouped,
  // setUpdateArticulated,
  setUpdateObservation,
  setUpdatePercentage,
  setUpdateRequirement,
} from "@/stores/features/diagnosisSlice";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import {
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
} from "@/interfaces/Diagnosis";
import {
  ConfigProvider,
  Input,
  Segmented,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { COMPLIANCE_LEVEL } from "../utils/constants";
import { useSearchParams } from "react-router-dom";
import { decryptId } from "@/utils/utilsMethods";

interface Props {
  companyId: number;
}
interface DataType extends DiagnosisQuestionsGroup {
  key: React.Key;
}

export default function DiagnosisDataTable({ companyId }: Props) {
  const dispatch = useAppDispatch();
  // const stepsLenght = useAppSelector((state) => state.util.stepLenght);
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;

  const {
    data: diagnosisQuestionsByCompany,
    refetch,
    isLoading,
  } = diagnosisService.useFindQuestionsByCompanysizeGroupedQuery({
    companyId,
    diagnosisId: diagnosisId ?? 0,
  });
  useEffect(() => {
    refetch();
  }, [companyId]);

  useEffect(() => {
    if (diagnosisQuestionsByCompany) {
      // Agrupar preguntas por step
      dispatch(setQuestionsGrouped(diagnosisQuestionsByCompany));
    }
  }, [diagnosisQuestionsByCompany, dispatch]);

  useEffect(() => {
    refetch();
  }, [dispatch]);

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
  const [_, setArticuledOption] = useState<{
    [qId: number]: boolean;
  }>({});
  // const [articuledOption, setArticuledOption] = useState<{
  //   [qId: number]: boolean;
  // }>({});

  const [observation, setObservation] = useState<{
    [reqId: number]: string | null;
  }>({});

  const handleObservationChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    req_id: number
  ) => {
    setObservation((prev) => ({
      ...prev,
      [req_id]: e.target.value,
    }));
    dispatch(
      setUpdateObservation({
        reqId: req_id,
        observation: observation[req_id],
      })
    );
    // Aquí podrías manejar la actualización del record.observation en el estado global o realizar otras acciones
  };

  useEffect(() => {
    // Reenderizado por defecto
    if (questionsGrouped.length > 0) {
      questionsGrouped.forEach((group) => {
        dispatch(
          setUpdateRequirement({
            compliance: group.compliance.id,
            observation: observation[group.id] ?? null,
            requirementId: group.id,
          })
        );
        group.questions.forEach((question) => {
          dispatch(
            setUpdatePercentage({
              questionId: question.id,
              compliance: diagnosisId
                ? question.compliance_detail?.id ?? COMPLIANCE_LEVEL.NO_CUMPLE
                : COMPLIANCE_LEVEL.NO_CUMPLE,
            })
          );
          setQuestionOption((prev) => ({
            ...prev,
            [question.id]: diagnosisId
              ? question.compliance_detail?.id ?? COMPLIANCE_LEVEL.NO_CUMPLE
              : COMPLIANCE_LEVEL.NO_CUMPLE,
          }));
          setArticuledOption((prev) => ({
            ...prev,
            [question.id]: true,
          }));
        });
        setSelectedOption((prev) => ({
          ...prev,
          [group.step]: group.compliance.id,
        }));
        setObservation((prev) => ({
          ...prev,
          [group.id]: group.observation,
        }));
      });
    }
  }, [questionsGrouped, dispatch]);

  const handleComplianceChange = (
    value: number,
    questionId: number,
    step: number,
    reqId: number
  ) => {
    dispatch(
      setUpdatePercentage({
        compliance: value,
        questionId,
      })
    );
    // Actualiza el estado local para la opción seleccionada
    setQuestionOption((prev) => {
      const newQuestionOptions = { ...prev, [questionId]: value };

      // Agrupa las preguntas por paso
      const grouped = questionsGrouped.filter((group) => group.step === step);

      // Obtén todas las respuestas para el paso específico
      const allQuestionValues = grouped.flatMap((group) =>
        group.questions.map((question) => newQuestionOptions[question.id])
      );

      // Determina el valor que se debe establecer en selectedOption
      const newSelectedOption = allQuestionValues.includes(3)
        ? COMPLIANCE_LEVEL.CUMPLE_PARCIALMENTE // Si hay al menos un valor 3
        : allQuestionValues.every((val) => val === COMPLIANCE_LEVEL.NO_CUMPLE)
        ? COMPLIANCE_LEVEL.NO_CUMPLE // Si todos los valores son 2
        : allQuestionValues.every(
            (val) =>
              val === COMPLIANCE_LEVEL.CUMPLE ||
              val == COMPLIANCE_LEVEL.NO_APLICA
          )
        ? COMPLIANCE_LEVEL.CUMPLE // Si todos los valores son 1
        : allQuestionValues.every(
            (val) =>
              val === COMPLIANCE_LEVEL.CUMPLE ||
              val === COMPLIANCE_LEVEL.NO_CUMPLE ||
              val === COMPLIANCE_LEVEL.CUMPLE_PARCIALMENTE
          )
        ? COMPLIANCE_LEVEL.CUMPLE_PARCIALMENTE
        : allQuestionValues.every((val) => val === COMPLIANCE_LEVEL.NO_APLICA)
        ? COMPLIANCE_LEVEL.NO_APLICA
        : COMPLIANCE_LEVEL.CUMPLE_PARCIALMENTE;

      // Actualiza selectedOption basado en la verificación
      setSelectedOption((prev) => ({
        ...prev,
        [step]: newSelectedOption,
      }));
      dispatch(
        setUpdateRequirement({
          compliance: newSelectedOption,
          observation: observation[reqId] ?? null,
          requirementId: reqId,
        })
      );

      return newQuestionOptions;
    });
  };

  // const handleArticulatedChange = (value: boolean, questionId: number) => {
  //   dispatch(setUpdateArticulated({ questionId, isArticulated: value }));
  //   setArticuledOption((prev) => ({
  //     ...prev,
  //     [questionId]: value,
  //   }));
  // };

  const handleGeneralChange = (value: number, step: number, req_id: number) => {
    if (questionsGrouped.length > 0) {
      dispatch(
        setUpdateRequirement({
          compliance: value,
          observation: observation[req_id],
          requirementId: req_id,
        })
      );
      questionsGrouped.forEach((group) => {
        group.questions.forEach((question) => {
          if (question.requirement_detail.step === step) {
            dispatch(
              setUpdatePercentage({
                questionId: question.id,
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
              onChange={(value) =>
                handleGeneralChange(value, record.step, record.id)
              }
            />
          </ConfigProvider>
        );
      },
    },
    {
      title: "Observacion",
      render: (_, record) => {
        return (
          <Input.TextArea
            value={observation[record.id] ?? ""}
            rows={1}
            className={
              selectedOption[record.step] !== 4
                ? "hidden transition-all"
                : "w-60 transition-all"
            }
            placeholder="En caso de que no aplique este paso"
            disabled={selectedOption[record.step] !== 4}
            autoSize={{ minRows: 1, maxRows: 6 }}
            onChange={(e) => handleObservationChange(e, record.id)}
          />
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
                      handleComplianceChange(
                        value,
                        question.id,
                        question.requirement_detail.step,
                        group.id
                      )
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
      loading={isLoading}
      dataSource={dataSource}
      pagination={false} // Desactiva la paginación si no la necesitas
      expandable={expandableConfig}
      rowClassName={() => "bg-slate-100"}
      className="w-full overflow-auto"
    />
  );
}
