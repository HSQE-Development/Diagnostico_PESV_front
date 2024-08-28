import { Button, Popconfirm } from "antd";
import React from "react";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

export default function ContinueOrSaveButton({
  userChanged,
  totalGeneral,
  consultorSelect,
  isLoading,
  confirm,
  updateDiagnosisLoading,
  handleUpdateDataOfDiagnosis,
  isOutOfContext,
  corporateLoading,
}: any) {
  return (
    <>
      {isOutOfContext || userChanged ? (
        <Button
          onClick={async () => await handleUpdateDataOfDiagnosis()}
          className="col-span-6 bg-orange-400 text-white border-orange-400 active:bg-orange-700 hover:bg-orange-300 disabled:bg-orange-200"
          loading={updateDiagnosisLoading || corporateLoading}
          disabled={
            isOutOfContext
              ? totalGeneral === 0 || consultorSelect == null
              : false
          }
        >
          Guardar Cambios
        </Button>
      ) : (
        <Popconfirm
          title="Empezar el diagnostico"
          description="Confirma todos los datos"
          onConfirm={async () => await confirm()}
          onCancel={() => null}
          okText="Continuar"
          cancelText="Cancelar"
        >
          <Button
            type="primary"
            className="col-span-6"
            disabled={totalGeneral == 0 || consultorSelect == null}
            loading={isLoading}
            icon={<LiaLongArrowAltRightSolid />}
            iconPosition="end"
          >
            Continuar
          </Button>
        </Popconfirm>
      )}
    </>
  );
}
