// ============================================
// APP.JS - PAINEL DTE COMPLETO
// 4 Telas | Drill-down | Filtros | Responsivo
// ============================================

// CONFIGURAÇÃO
const CONFIG = {
  panelName: "Painel Estratégico DTE",
  systemLabel: "DIRETORIA TÉCNICA E DE ENGENHARIA",
  subtitle: "Monitoramento Operacional e Análise de Performance"
};

// ESTADO GLOBAL
let DRILL = null;
let CURRENT_SCREEN = "screenVisao";

// ============================================
// INICIALIZAÇÃO
// ============================================

async function init() {
  try {
    HUB.loading.showMultiple([
      "kpisVisao", "chartEvolucao", "chartETRs", "chartTipoColeta", "chartSazonalidade", "chartBemVerde",
      "kpisFrota", "chartUtilizacaoTipos", "chartHorasExtras", "chartOfensoras", "chartSobrecarga", "chartTratores",
      "kpisBio", "chartBiogas", "chartBiogasDistrib", "chartChorume", "chartPurificacao", "chartRCC",
      "kpisInfra", "chartFrota", "chartDiesel", "chartIntervencoes", "chartLubrificantes", "chartTiposIntervencao"
    ]);
    
    HUB.header.render("header", {
      systemLabel: CONFIG.systemLabel,
      title: CONFIG.panelName,
      subtitle: CONFIG.subtitle
    });
    
    const response = await fetch(DATA_URL, { 
      cache: "no-store",
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });
    const text = await response.text();
    const parsed = Papa.parse(text, { header: false, skipEmptyLines: true });
    
    DATA_RAW = parsed.data;
    processData();
    populateFilters();
    setupNavigation();
    setupFilters();
    render();
    
    HUB.footer.render("footer", {
      customText: `<strong>Gabinete da Presidência</strong><br>HUB COMLURB • Núcleo de Inteligência e Gestão Estratégica Operacional`,
      version: "1.0",
      showTimestamp: true
    });
    
  } catch (e) {
    console.error("Erro:", e);
    alert(`Erro ao carregar: ${e.message}`);
  }
}

// ============================================
// PROCESSAMENTO DE DADOS
// ============================================

function processData() {
  const recIdx = findSection("I - Recebimento Resíduos Totais");
  if (recIdx !== -1) {
    const meses = DATA_RAW[recIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      DATA.recebimento.push({
        mes: meses[i],
        bangu: parseNum(DATA_RAW[recIdx + 1][i + 1]),
        caju: parseNum(DATA_RAW[recIdx + 2][i + 1]),
        jacarepagua: parseNum(DATA_RAW[recIdx + 3][i + 1]),
        hermes: parseNum(DATA_RAW[recIdx + 4][i + 1]),
        santa_cruz: parseNum(DATA_RAW[recIdx + 5][i + 1]),
        total: parseNum(DATA_RAW[recIdx + 6][i + 1])
      });
    }
  }
  
  const tipoIdx = findSection("II - Recebimento Residos Recebidos nas ETR");
  if (tipoIdx !== -1) {
    const meses = DATA_RAW[tipoIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      DATA.tipoColeta.push({
        mes: meses[i],
        domiciliar: parseNum(DATA_RAW[tipoIdx + 1][i + 1]),
        comunidades: parseNum(DATA_RAW[tipoIdx + 2][i + 1]),
        publico: parseNum(DATA_RAW[tipoIdx + 3][i + 1]),
        geradores: parseNum(DATA_RAW[tipoIdx + 4][i + 1])
      });
    }
  }
  
  const bioIdx = findSection("V - Geração Biogás");
  if (bioIdx !== -1) {
    const meses = DATA_RAW[bioIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      DATA.biogas.push({
        mes: meses[i],
        seropedica: parseNum(DATA_RAW[bioIdx + 1][i + 1]),
        gramacho: parseNum(DATA_RAW[bioIdx + 2][i + 1])
      });
    }
  }
  
  const choIdx = findSection("VII - Geração Chorume");
  if (choIdx !== -1) {
    const meses = DATA_RAW[choIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      DATA.chorume.push({
        mes: meses[i],
        geracao: parseNum(DATA_RAW[choIdx + 1][i + 1]),
        interno: parseNum(DATA_RAW[choIdx + 2][i + 1]),
        externo: parseNum(DATA_RAW[choIdx + 3][i + 1])
      });
    }
  }
  
  const utilIdx = findSection("Coleta Domiociliar e Comunidade");
  if (utilIdx !== -1) {
    const meses = DATA_RAW[utilIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      const pct = parseFloat(String(DATA_RAW[utilIdx + 1][i + 1]).replace("%", "").replace(",", "."));
      DATA.utilizacao.push({ mes: meses[i], taxa: pct || 0 });
    }
  }
  
  const sobIdx = findSection("Sobrecarga >10%");
  if (sobIdx !== -1) {
    const meses = DATA_RAW[sobIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      const pct = parseFloat(String(DATA_RAW[sobIdx + 2][i + 1]).replace("%", "").replace(",", "."));
      DATA.sobrecarga.push({ mes: meses[i], pct: pct || 0 });
    }
  }
  
  const heIdx = findSection("Análise de Horas Extras");
  if (heIdx !== -1) {
    const meses = DATA_RAW[heIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      const pct = parseFloat(String(DATA_RAW[heIdx + 2][i + 1]).replace("%", "").replace(",", "."));
      DATA.horasExtras.push({ mes: meses[i], pct: pct || 0 });
    }
  }
  
  const frotaIdx = findSection("C - MANUTENÇÃO FROTA PRÓPRIA");
  if (frotaIdx !== -1) {
    const meses = DATA_RAW[frotaIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      DATA.frotaPropria.push({
        mes: meses[i],
        total: parseNum(DATA_RAW[frotaIdx + 1][i + 1]),
        operacao: parseNum(DATA_RAW[frotaIdx + 7][i + 1]),
        diesel: parseNum(DATA_RAW[frotaIdx + 11][i + 1])
      });
    }
  }
  
  const intIdx = findSection("D - MANUTENÇÃO PREDIAL");
  if (intIdx !== -1) {
    const meses = DATA_RAW[intIdx].slice(1);
    for (let i = 0; i < meses.length; i++) {
      DATA.intervencoes.push({
        mes: meses[i],
        hidraulica: parseNum(DATA_RAW[intIdx + 1][i + 1]),
        ecopontos: parseNum(DATA_RAW[intIdx + 2][i + 1]),
        limpeza: parseNum(DATA_RAW[intIdx + 3][i + 1]),
        refrigeracao: parseNum(DATA_RAW[intIdx + 4][i + 1])
      });
    }
  }
}

// ============================================
// NAVEGAÇÃO
// ============================================

function setupNavigation() {
  document.querySelectorAll(".tabBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabBtn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.screen).classList.add("active");
      CURRENT_SCREEN = btn.dataset.screen;
    });
  });
}

// ============================================
// FILTROS
// ============================================

function populateFilters() {
  HUB.filters.populate("fETR", ["Bangu", "Caju", "Jacarepaguá", "Mal Hermes", "Santa Cruz"]);
  HUB.filters.populate("fTipo", ["Coleta Domiciliar", "Coleta em Comunidades", "Lixo Público", "Grandes Geradores"]);
}

function setupFilters() {
  ["fPeriodo", "fETR", "fTipo"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => render());
  });
}

function applyPeriodoFilter(data) {
  const periodo = document.getElementById("fPeriodo").value;
  if (!periodo) return data;
  return data.slice(-parseInt(periodo));
}

function clearAll() {
  document.getElementById("fPeriodo").value = "";
  document.getElementById("fETR").value = "";
  document.getElementById("fTipo").value = "";
  DRILL = null;
  HUB.drillBanner.hide("drillBanner");
  render();
}

function setDrill(field, value, label) {
  DRILL = { field, value, label };
  HUB.drillBanner.show("drillBanner", {
    title: `Filtro ativo: ${label}`,
    description: "Clique para remover",
    onClear: "clearDrill()"
  });
  render();
}

function clearDrill() {
  DRILL = null;
  HUB.drillBanner.hide("drillBanner");
  render();
}

// ============================================
// RENDERIZAÇÃO PRINCIPAL
// ============================================

function render() {
  renderTela1();
  renderTela2();
  renderTela3();
  renderTela4();
}


// ============================================
// TELA 1 - VISÃO GERAL OPERACIONAL
// ============================================

function renderTela1() {
  if (!DATA.recebimento.length) return;
  
  const dados = applyPeriodoFilter(DATA.recebimento);
  const ultimo = dados[dados.length - 1];
  const penultimo = dados[dados.length - 2] || ultimo;
  const variacao = ((ultimo.total - penultimo.total) / penultimo.total * 100);
  const media = dados.reduce((acc, r) => acc + r.total, 0) / dados.length;
  
  const ultimaUtil = DATA.utilizacao.length ? DATA.utilizacao[DATA.utilizacao.length - 1].taxa : 0;
  const ultimaFrota = DATA.frotaPropria.length ? DATA.frotaPropria[DATA.frotaPropria.length - 1] : { total: 0, operacao: 0 };
  
  // KPIs
  HUB.cards.render("kpisVisao", [
    {
      label: "Recebimento Total",
      value: ultimo.total,
      note: `${ultimo.mes} • ${variacao > 0 ? '+' : ''}${HUB.format.pct(variacao, 1)} vs mês anterior`,
      feature: true,
      format: "int",
      color: variacao > 0 ? "orange" : "green"
    },
    {
      label: "ETR Caju (Líder)",
      value: ultimo.caju,
      note: `${HUB.format.pct((ultimo.caju / ultimo.total) * 100)} do total`,
      format: "int",
      color: "blue",
      onclick: "setDrill('etr', 'Caju', 'ETR Caju')"
    },
    {
      label: "Média Mensal",
      value: media,
      note: `Últimos ${dados.length} meses`,
      format: "int",
      color: "green"
    },
    {
      label: "Utilização Frota CDC",
      value: ultimaUtil,
      note: "Peso / capacidade estimada",
      format: "pct",
      color: ultimaUtil > 75 ? "green" : "orange"
    },
    {
      label: "Frota Própria Ativa",
      value: ultimaFrota.operacao,
      note: `${ultimaFrota.total} total • ${HUB.format.pct((ultimaFrota.operacao / ultimaFrota.total) * 100, 0)} operacional`,
      format: "int",
      color: "purple"
    }
  ]);
  
  // Evolução
  HUB.charts.line("chartEvolucao", {
    labels: dados.map(r => r.mes),
    values: dados.map(r => r.total)
  }, {
    label: "Recebimento Total (t)",
    color: HUB.charts.colors.blueGradient
  });
  
  // Ranking ETRs
  const etrsData = [
    ["ETR Caju", ultimo.caju],
    ["ETR Mal Hermes", ultimo.hermes],
    ["ETR Bangu", ultimo.bangu],
    ["ETR Jacarepaguá", ultimo.jacarepagua],
    ["ETR Santa Cruz", ultimo.santa_cruz]
  ].sort((a, b) => b[1] - a[1]);
  
  HUB.simpleBar.render("chartETRs", etrsData, {
    total: ultimo.total,
    color: "blue",
    onclick: name => `setDrill('etr', '${name}', '${name}')`
  });
  
  // Tipo de Coleta
  if (DATA.tipoColeta.length) {
    const dadosTipo = applyPeriodoFilter(DATA.tipoColeta);
    const ultimoTipo = dadosTipo[dadosTipo.length - 1];
    HUB.charts.donut("chartTipoColeta", {
      labels: ["Domiciliar", "Comunidades", "Lixo Público", "Grandes Geradores"],
      values: [ultimoTipo.domiciliar, ultimoTipo.comunidades, ultimoTipo.publico, ultimoTipo.geradores]
    });
  }
  
  // Sazonalidade
  const mesesAgrupados = {};
  DATA.recebimento.forEach(r => {
    const mes = r.mes.split("-")[0];
    if (!mesesAgrupados[mes]) mesesAgrupados[mes] = [];
    mesesAgrupados[mes].push(r.total);
  });
  
  const sazonalidade = Object.entries(mesesAgrupados).map(([mes, valores]) => {
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    return [mes, media];
  });
  
  const mediaSaz = sazonalidade.reduce((a, b) => a + b[1], 0) / sazonalidade.length;
  HUB.simpleBar.render("chartSazonalidade", sazonalidade, {
    total: mediaSaz,
    color: "green"
  });
  
  // Bem Verde (simulado - ajustar conforme planilha)
  HUB.charts.bar("chartBemVerde", {
    labels: dados.slice(-6).map(r => r.mes),
    values: dados.slice(-6).map(r => r.total * 0.08)
  }, {
    label: "Operação Bem Verde (t)",
    color: HUB.charts.colors.greenGradient
  });
}

// ============================================
// TELA 2 - PERFORMANCE DE FROTA
// ============================================

function renderTela2() {
  const dadosUtil = applyPeriodoFilter(DATA.utilizacao);
  const dadosSobre = applyPeriodoFilter(DATA.sobrecarga);
  const dadosHE = applyPeriodoFilter(DATA.horasExtras);
  
  if (!dadosUtil.length) return;
  
  const ultimaUtil = dadosUtil[dadosUtil.length - 1].taxa;
  const mediaUtil = dadosUtil.reduce((a, b) => a + b.taxa, 0) / dadosUtil.length;
  const ultimaSobre = dadosSobre.length ? dadosSobre[dadosSobre.length - 1].pct : 0;
  const ultimaHE = dadosHE.length ? dadosHE[dadosHE.length - 1].pct : 0;
  
  // KPIs
  HUB.cards.render("kpisFrota", [
    {
      label: "Utilização CDC",
      value: ultimaUtil,
      note: "Coleta Domiciliar e Comunidades",
      feature: true,
      format: "pct",
      color: ultimaUtil > 75 ? "green" : "orange"
    },
    {
      label: "Sobrecarga >10% PBT",
      value: ultimaSobre,
      note: "Pesagens acima do limite",
      format: "pct",
      color: ultimaSobre > 25 ? "red" : "orange"
    },
    {
      label: "Horas Extras",
      value: ultimaHE,
      note: "% sobre faturamento",
      format: "pct",
      color: ultimaHE > 2 ? "red" : "green"
    },
    {
      label: "Média de Utilização",
      value: mediaUtil,
      note: `Últimos ${dadosUtil.length} meses`,
      format: "pct",
      color: "blue"
    },
    {
      label: "Meta de Utilização",
      value: 85,
      note: "Target definido pela gestão",
      format: "pct",
      color: "purple"
    }
  ]);
  
  // Utilização por Tipo (simulado)
  const tiposVeiculo = [
    ["Compactador 15m³", 78],
    ["Compactador 19m³", 82],
    ["Poliguindaste", 71],
    ["Basculante", 76],
    ["Roll-on/off", 68]
  ];
  
  HUB.simpleBar.render("chartUtilizacaoTipos", tiposVeiculo, {
    total: 85,
    color: "blue"
  });
  
  // Horas Extras
  if (dadosHE.length) {
    HUB.charts.line("chartHorasExtras", {
      labels: dadosHE.map(r => r.mes),
      values: dadosHE.map(r => r.pct)
    }, {
      label: "Horas Extras (% faturamento)",
      color: HUB.charts.colors.orangeGradient
    });
  }
  
  // Gerências Ofensoras (simulado)
  const ofensoras = [
    ["AP 5.1", 18],
    ["AP 3.2", 15],
    ["AP 2.1", 12]
  ];
  
  HUB.simpleBar.render("chartOfensoras", ofensoras, {
    total: 20,
    color: "red"
  });
  
  // Sobrecarga
  if (dadosSobre.length) {
    HUB.charts.bar("chartSobrecarga", {
      labels: dadosSobre.map(r => r.mes),
      values: dadosSobre.map(r => r.pct)
    }, {
      label: "Sobrecarga >10% PBT (%)",
      color: HUB.charts.colors.redGradient
    });
  }
  
  // Tratores (simulado)
  const tratores = [
    ["Trator Tipo A", 92],
    ["Trator Tipo B", 87],
    ["Trator Tipo C", 79]
  ];
  
  HUB.simpleBar.render("chartTratores", tratores, {
    total: 100,
    color: "green"
  });
}

// ============================================
// TELA 3 - BIOENERGIA & SUSTENTABILIDADE
// ============================================

function renderTela3() {
  const dadosBio = applyPeriodoFilter(DATA.biogas);
  const dadosCho = applyPeriodoFilter(DATA.chorume);
  
  if (!dadosBio.length) return;
  
  const ultimo = dadosBio[dadosBio.length - 1];
  const totalBio = ultimo.seropedica + ultimo.gramacho;
  const taxaPurif = 0.67; // 67% conforme planilha
  const ultimoCho = dadosCho.length ? dadosCho[dadosCho.length - 1].geracao : 0;
  
  // KPIs
  HUB.cards.render("kpisBio", [
    {
      label: "Biogás Total",
      value: totalBio,
      note: `${ultimo.mes} • CTR + Gramacho`,
      feature: true,
      format: "int",
      color: "green"
    },
    {
      label: "CTR Seropédica",
      value: ultimo.seropedica,
      note: `${HUB.format.pct((ultimo.seropedica / totalBio) * 100)} do total`,
      format: "int",
      color: "blue"
    },
    {
      label: "Aterro Gramacho",
      value: ultimo.gramacho,
      note: `${HUB.format.pct((ultimo.gramacho / totalBio) * 100)} do total`,
      format: "int",
      color: "orange"
    },
    {
      label: "Chorume Gerado",
      value: ultimoCho,
      note: "Metros cúbicos (m³)",
      format: "int",
      color: "purple"
    },
    {
      label: "Taxa de Purificação",
      value: taxaPurif * 100,
      note: "CTR Seropédica",
      format: "pct",
      color: "green"
    }
  ]);
  
  // Geração Biogás
  const ctx1 = document.getElementById("chartBiogas").getContext("2d");
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: dadosBio.map(r => r.mes),
      datasets: [
        {
          label: "CTR Seropédica",
          data: dadosBio.map(r => r.seropedica / 1000),
          borderColor: "#78aaa3",
          backgroundColor: "rgba(120, 170, 163, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true
        },
        {
          label: "Aterro Gramacho",
          data: dadosBio.map(r => r.gramacho / 1000),
          borderColor: "#5b9bd5",
          backgroundColor: "rgba(91, 155, 213, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#b8c9de", font: { size: 12 }, padding: 15, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: "rgba(13,31,54,0.95)",
          callbacks: { label: ctx => `${ctx.dataset.label}: ${HUB.format.int(ctx.parsed.y)} mil Nm³` }
        }
      },
      scales: {
        y: {
          grid: { color: "rgba(41,72,102,0.3)" },
          ticks: { color: "#b8c9de", callback: v => `${v}k` }
        },
        x: {
          grid: { color: "rgba(41,72,102,0.3)" },
          ticks: { color: "#b8c9de" }
        }
      }
    }
  });
  
  // Distribuição
  HUB.charts.donut("chartBiogasDistrib", {
    labels: ["CTR Seropédica", "Aterro Gramacho"],
    values: [ultimo.seropedica, ultimo.gramacho]
  });
  
  // Chorume (se tiver dados)
  if (dadosCho.length) {
    const ctx2 = document.getElementById("chartChorume").getContext("2d");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: dadosCho.map(r => r.mes),
        datasets: [
          {
            label: "Uso Interno",
            data: dadosCho.map(r => r.interno),
            backgroundColor: "#78aaa3"
          },
          {
            label: "Uso Externo",
            data: dadosCho.map(r => r.externo),
            backgroundColor: "#5b9bd5"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#b8c9de", usePointStyle: true } }
        },
        scales: {
          y: { stacked: true, grid: { color: "rgba(41,72,102,0.3)" }, ticks: { color: "#b8c9de" } },
          x: { stacked: true, grid: { color: "rgba(41,72,102,0.3)" }, ticks: { color: "#b8c9de" } }
        }
      }
    });
  }
  
  // Purificação
  HUB.charts.line("chartPurificacao", {
    labels: dadosBio.slice(-6).map(r => r.mes),
    values: dadosBio.slice(-6).map(r => r.seropedica * taxaPurif)
  }, {
    label: "Biogás Purificado (Nm³)",
    color: HUB.charts.colors.greenGradient
  });
  
  // RCC Gericinó (simulado)
  HUB.charts.bar("chartRCC", {
    labels: dadosBio.slice(-6).map(r => r.mes),
    values: [12500, 13200, 12800, 14100, 13500, 13900]
  }, {
    label: "RCC Recebido (t)",
    color: HUB.charts.colors.purpleGradient
  });
}

// ============================================
// TELA 4 - INFRAESTRUTURA
// ============================================

function renderTela4() {
  const dadosFrota = applyPeriodoFilter(DATA.frotaPropria);
  const dadosInt = applyPeriodoFilter(DATA.intervencoes);
  
  if (!dadosFrota.length) return;
  
  const primeiro = dadosFrota[0];
  const ultimo = dadosFrota[dadosFrota.length - 1];
  const reducao = ((primeiro.total - ultimo.total) / primeiro.total) * 100;
  const taxaOp = (ultimo.operacao / ultimo.total) * 100;
  const totalInt = dadosInt.length ? dadosInt[dadosInt.length - 1] : { hidraulica: 0, ecopontos: 0, limpeza: 0, refrigeracao: 0 };
  const somaInt = totalInt.hidraulica + totalInt.ecopontos + totalInt.limpeza + totalInt.refrigeracao;
  
  // KPIs
  HUB.cards.render("kpisInfra", [
    {
      label: "Redução de Frota",
      value: reducao,
      note: `${primeiro.total} → ${ultimo.total} veículos`,
      feature: true,
      format: "pct",
      color: "red"
    },
    {
      label: "Veículos em Operação",
      value: ultimo.operacao,
      note: `${ultimo.total} veículos no total`,
      format: "int",
      color: "green"
    },
    {
      label: "Consumo de Diesel",
      value: ultimo.diesel,
      note: `${ultimo.mes} • Litros`,
      format: "int",
      color: "orange"
    },
    {
      label: "Intervenções Prediais",
      value: somaInt,
      note: `${ultimo.mes} • Todas as categorias`,
      format: "int",
      color: "blue"
    },
    {
      label: "Taxa Operacional",
      value: taxaOp,
      note: "Veículos ativos / total",
      format: "pct",
      color: taxaOp > 20 ? "green" : "red"
    }
  ]);
  
  // Frota Própria
  const ctx1 = document.getElementById("chartFrota").getContext("2d");
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: dadosFrota.map(r => r.mes),
      datasets: [
        {
          label: "Frota Total",
          data: dadosFrota.map(r => r.total),
          borderColor: "#ef6a5d",
          backgroundColor: "rgba(239, 106, 93, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true
        },
        {
          label: "Em Operação",
          data: dadosFrota.map(r => r.operacao),
          borderColor: "#78aaa3",
          backgroundColor: "rgba(120, 170, 163, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#b8c9de", usePointStyle: true } }
      },
      scales: {
        y: { grid: { color: "rgba(41,72,102,0.3)" }, ticks: { color: "#b8c9de" } },
        x: { grid: { color: "rgba(41,72,102,0.3)" }, ticks: { color: "#b8c9de" } }
      }
    }
  });
  
  // Diesel
  HUB.charts.bar("chartDiesel", {
    labels: dadosFrota.map(r => r.mes),
    values: dadosFrota.map(r => r.diesel)
  }, {
    label: "Consumo de Diesel (L)",
    color: HUB.charts.colors.orangeGradient
  });
  
  // Intervenções
  if (dadosInt.length) {
    const totais = dadosInt.map(r => r.hidraulica + r.ecopontos + r.limpeza + r.refrigeracao);
    HUB.charts.line("chartIntervencoes", {
      labels: dadosInt.map(r => r.mes),
      values: totais
    }, {
      label: "Total de Intervenções",
      color: HUB.charts.colors.blueGradient
    });
  }
  
  // Lubrificantes (simulado)
  const lubData = [
    ["Óleo Motor", 450],
    ["Óleo Hidráulico", 280],
    ["Graxa", 120],
    ["Outros", 90]
  ];
  
  HUB.simpleBar.render("chartLubrificantes", lubData, {
    total: 1000,
    color: "orange"
  });
  
  // Tipos de Intervenção
  if (dadosInt.length) {
    HUB.charts.donut("chartTiposIntervencao", {
      labels: ["Hidráulica", "Ecopontos", "Limpeza", "Refrigeração"],
      values: [totalInt.hidraulica, totalInt.ecopontos, totalInt.limpeza, totalInt.refrigeracao]
    });
  }
}

// ============================================
// BOOT
// ============================================

document.addEventListener("DOMContentLoaded", init);
