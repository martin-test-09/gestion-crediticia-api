export const bcraFixtures = {
  "20000000001": {
    denominacion: "CLIENTE DEMO SITUACION UNO",
    periodo: "202606",
    entidades: [
      { entidad: "BANCO DEMO", situacion: 1, monto: 120000, diasAtrasoPago: 0, refinanciaciones: false, enRevision: false, procesoJud: false }
    ]
  },
  "20000000002": {
    denominacion: "CLIENTE DEMO SITUACION DOS",
    periodo: "202606",
    entidades: [
      { entidad: "BANCO DEMO", situacion: 2, monto: 350000, diasAtrasoPago: 15, refinanciaciones: false, enRevision: false, procesoJud: false }
    ]
  },
  "20000000003": {
    denominacion: "CLIENTE DEMO SITUACION TRES",
    periodo: "202606",
    entidades: [
      { entidad: "BANCO DEMO", situacion: 3, monto: 700000, diasAtrasoPago: 60, refinanciaciones: true, enRevision: false, procesoJud: false }
    ]
  },
  "20000000004": {
    denominacion: "CLIENTE DEMO SITUACION CUATRO",
    periodo: "202606",
    entidades: [
      { entidad: "BANCO DEMO", situacion: 4, monto: 1100000, diasAtrasoPago: 120, refinanciaciones: false, enRevision: false, procesoJud: false }
    ]
  },
  "20000000005": {
    denominacion: "CLIENTE DEMO SITUACION CINCO",
    periodo: "202606",
    entidades: [
      { entidad: "BANCO DEMO", situacion: 5, monto: 1800000, diasAtrasoPago: 180, refinanciaciones: false, enRevision: false, procesoJud: true }
    ]
  },
  "20000000006": {
    denominacion: "CLIENTE DEMO MULTIENTIDAD",
    periodo: "202606",
    entidades: [
      { entidad: "BANCO UNO", situacion: 1, monto: 150000, diasAtrasoPago: 0, refinanciaciones: false, enRevision: false, procesoJud: false },
      { entidad: "BANCO DOS", situacion: 3, monto: 500000, diasAtrasoPago: 40, refinanciaciones: false, enRevision: false, procesoJud: false }
    ]
  }
};
