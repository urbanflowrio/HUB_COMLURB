# 🏥 Painel SMS - Limpeza e Higienização Hospitalar

## 📋 Descrição

Plataforma executiva de monitoramento operacional e financeiro do contrato de limpeza e higienização hospitalar da rede municipal de saúde do Rio de Janeiro. 

O painel integra indicadores de postos contratados, faturamento, efetivo operacional, containers de resíduos e distribuição territorial das unidades atendidas, permitindo leitura estratégica da execução contratual em diferentes níveis de gestão.

---

## 🏥 Unidades Hospitalares

### **Ativas no Contrato:**

1. **Hospital Municipal Miguel Couto**
   - Receita Mensal: R$ 1.260.796
   - Efetivo: 111 garis
   - Localização: -22.9856, -43.2009

2. **Hospital Municipal Salgado Filho**
   - Receita Mensal: R$ 1.201.051
   - Efetivo: 106 garis
   - Localização: -22.8897, -43.2827

3. **Hospital Municipal Lourenço Jorge / Maternidade Leila Diniz**
   - Receita Mensal: R$ 1.576.412
   - Efetivo: 145 garis
   - Localização (HM Lourenço Jorge): -22.9749, -43.3654
   - Localização (Maternidade Leila Diniz): -22.9147, -43.2303

### **Saída do Contrato:**

4. **Hospital Municipal Ronaldo Gazolla**
   - Status: Inativo desde meados de 2024
   - Último faturamento: Junho/2024

---

## 📊 Indicadores Principais

- **Unidades Ativas:** 3 hospitais
- **Efetivo Total:** 362 garis
- **Expectativa Mensal:** R$ 4.038.260
- **Vencimento:** 01/01/2028
- **Reajuste:** Bienal

---

## 📂 Estrutura de Arquivos

```
/sms/
├── index.html       # Estrutura HTML com 3 telas
├── data.js          # Carregamento e processamento de dados
├── screens.js       # Renderização das telas
├── app.js           # Orquestração e controle
└── README.md        # Este arquivo
```

---

## 🔗 Fontes de Dados

### **CSV 1: Faturamento Histórico**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQr5S1R56YvP2uYOVJorK3b5CxUghxDNyZu6V6t7Kq_hoxJoj4zrTQVh77NGZPm_IdrBT_xwIU3pca9/pub?gid=24719560&single=true&output=csv
```

**Colunas:**
- ANO, MÊS
- HOSPITAL MUNICIPAL LOURENÇO JORGE/MATERNIDADE LEILA DINIZ
- HOSPITAL MUNICIPAL MIGUEL COUTO
- HOSPITAL MUNICIPAL RONALDO GAZOLLA
- HOSPITAL MUNICIPAL SALGADO FILHO

### **CSV 2: Containers (Consolidado)**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQr5S1R56YvP2uYOVJorK3b5CxUghxDNyZu6V6t7Kq_hoxJoj4zrTQVh77NGZPm_IdrBT_xwIU3pca9/pub?output=csv
```

**Colunas:**
- HOSPITAL
- TOTAL (containers totais)
- RSS (containers de resíduos sólidos de saúde)

**Atualização:** Automática via planilha Google Sheets

---

## 🖥️ Telas do Painel

### **1. Visão Executiva**
- 5 KPIs principais (unidades, faturamento, garis, containers)
- Gráfico de faturamento por hospital
- Resumo do contrato
- Mapa com distribuição territorial

### **2. Estrutura Contratual**
- Cards detalhados por hospital
- Receita mensal, efetivo, containers
- Informações contratuais (vencimento, reajuste)
- Coordenadas geográficas

### **3. Territorial**
- Resumo territorial (3 cards)
- Mapa interativo com marcadores
- Ranking de unidades por efetivo operacional

---

## 🛠️ Componentes Utilizados

- **HUB.utils** - Carregamento de CSV, formatação
- **HUB.cards** - Renderização de KPIs
- **HUB.charts** - Gráficos HTML
- **HUB.layout** - Header e footer

---

## 📝 Observações Importantes

1. **Gazolla saiu do contrato** em meados de 2024 (último faturamento em junho/2024)
2. **Leila Diniz** é vinculada ao Lourenço Jorge (receita unificada)
3. **Containers** são atualizados automaticamente via CSV consolidado
4. **Coordenadas** são fixas (hardcoded no data.js)

---

## 🚀 Como Usar

1. **Fazer upload** da pasta `/sms/` para o repositório
2. **Acessar:** `https://urbanflowrio.github.io/HUB_COMLURB/sms/`
3. Dados carregam automaticamente dos CSVs públicos

---

## 🔄 Atualização de Dados

Os dados são carregados em tempo real dos Google Sheets publicados. Para atualizar:

1. Edite a planilha fonte no Google Sheets
2. A publicação é automática
3. Recarregue o painel no navegador

**Cache:** Os dados ficam em cache no localStorage por 1 hora.

---

## 📧 Contato

**Gabinete da Presidência**  
HUB COMLURB • Núcleo de Inteligência e Gestão Estratégica Operacional

---

**Versão:** 1.0  
**Última Atualização:** Maio 2026
