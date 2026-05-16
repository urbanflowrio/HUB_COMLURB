// ============================================
// DATA.JS - PAINEL DTE
// Dados da Diretoria Técnica e de Engenharia
// ============================================

// ============================================
// URL DO GOOGLE SHEETS - ATUALIZAÇÃO AUTOMÁTICA MENSAL
// ============================================

/**
 * IMPORTANTE: Esta planilha é atualizada MENSALMENTE
 * O painel lê os dados SEMPRE que é carregado (sem cache)
 * 
 * URL da planilha publicada como CSV:
 */
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRbfRYtnjYlxLIPTfIpC_Q7ftJ6uUf1BK9gcZs_CSEiEnIE7qCAk_U_3_bibXftsCAf5K1uQdAPsOx/pub?output=csv";

// ============================================
// ESTRUTURA DE DADOS GLOBAIS
// ============================================

// Dados RAW do CSV
let DATA_RAW = [];

// Dados processados por seção
let DATA = {
  recebimento: [],      // Seção A-I: Recebimento nas ETRs
  tipoColeta: [],       // Seção A-II: Por tipo de coleta
  biogas: [],           // Seção V: Geração de biogás
  chorume: [],          // Seção VII: Geração de chorume
  utilizacao: [],       // Seção B: Utilização de frota CDC
  sobrecarga: [],       // Seção B: Sobrecarga de veículos
  horasExtras: [],      // Seção B: Horas extras
  frotaPropria: [],     // Seção C: Frota própria
  intervencoes: []      // Seção D: Intervenções prediais
};

// ============================================
// METADADOS E LABELS
// ============================================

const ETR_NAMES = {
  bangu: "ETR Bangu",
  caju: "ETR Caju",
  jacarepagua: "ETR Jacarepaguá",
  hermes: "ETR Mal Hermes",
  santa_cruz: "ETR Santa Cruz"
};

const TIPO_COLETA_NAMES = {
  domiciliar: "Coleta Domiciliar",
  comunidades: "Coleta em Comunidades",
  publico: "Lixo Público",
  geradores: "Grandes Geradores"
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Converte string para número (trata vírgulas e pontos)
 */
function parseNum(val) {
  if (!val || val === '') return 0;
  const str = String(val).replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Encontra a linha de início de uma seção na planilha
 */
function findSection(keyword) {
  for (let i = 0; i < DATA_RAW.length; i++) {
    if (DATA_RAW[i][0] && DATA_RAW[i][0].includes(keyword)) {
      return i;
    }
  }
  return -1;
}

// ============================================
// OBSERVAÇÕES SOBRE A PLANILHA
// ============================================

/**
 * ESTRUTURA ESPERADA DA PLANILHA:
 * 
 * Linha 1: DIRETORIA TÉCNICA E DE ENGENHARIA - DTE 
 * Linha 2: A - ATIVIDADES OPERACIONAIS - COORDENADORIA DE DESTINAÇÃO DE RESÍDUOS - TCD
 * Linha 3: I - Recebimento Resíduos Totais - t | abr-25 | mai-25 | jun-25 ...
 * Linha 4: ETR Bangu - t                        | 46.155 | 48.998 | ...
 * Linha 5: ETR Caju - t                         | 92.326 | 95.340 | ...
 * ...
 * 
 * O painel processa automaticamente todas as seções:
 * - Seção A-I: Recebimento ETRs
 * - Seção A-II: Tipo de Coleta
 * - Seção V: Biogás
 * - Seção VII: Chorume
 * - Seção B: Frota Contratada
 * - Seção C: Frota Própria
 * - Seção D: Intervenções Prediais
 * 
 * IMPORTANTE: Manter a estrutura de cabeçalhos e seções
 */
