export function calcularCuotaMensual({ montoFinanciado, tasaNominalAnual, plazoMeses }) {
  const monto = Number(montoFinanciado);
  const tasa = Number(tasaNominalAnual);
  const plazo = Number(plazoMeses);
  const tasaMensual = (tasa / 100) / 12;

  const cuota = tasaMensual === 0
    ? monto / plazo
    : (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));

  return Math.round(cuota * 100) / 100;
}
