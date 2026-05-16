// ============================================
// DATA.JS - PAINEL DTE
// 2 Planilhas Google Sheets Integradas
// ============================================

// ============================================
// PLANILHA 1 - Dados Operacionais DTE
// ============================================
const DATA_URL_1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRbfRYtnjYlxLIPTfIpC_Q7ftJ6uUf1BK9gcZs_CSEiEnIE7qCAk_U_3_bibXftsCAf5K1uQdAPsOx/pub?output=csv";

// ============================================
// PLANILHA 2 - Dados Complementares (Tabela_1493)
// ============================================
const DATA_URL_2 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGM0j-OA3ERumBvilwumifE-V60PLI_iDOUwc1KGOYl47cEr74-O7tkKuAjf6yykn8cd7V7mAorDNL/pub?gid=925345857&single=true&output=csv";

// ============================================
// ESTRUTURA DE DADOS GLOBAIS
// ============================================

let DATA_RAW = [];
let DATA_RAW_2 = [];

let DATA = {
  recebimento: [],
  tipoColeta: [],
  biogas: [],
  chorume: [],
  utilizacao: [],
  sobrecarga: [],
  horasExtras: [],
  frotaPropria: [],
  intervencoes: []
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function parseNum(val) {
  if (!val || val === '') return 0;
  const str = String(val).replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function findSection(keyword) {
  for (let i = 0; i < DATA_RAW.length; i++) {
    if (DATA_RAW[i][0] && DATA_RAW[i][0].includes(keyword)) {
      return i;
    }
  }
  return -1;
}
