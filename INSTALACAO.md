# 🚀 Guia de Instalação - Painel DTE

## 📁 Estrutura de Pastas Completa

```
hub-comlurb/                          ← RAIZ DO PROJETO
│
├── assets/                           ← ASSETS COMPARTILHADOS
│   ├── css/
│   │   └── hub-premium.css          ← CSS tema navy + glow (OBRIGATÓRIO)
│   │
│   ├── components/                   ← COMPONENTES HUB (OBRIGATÓRIOS)
│   │   ├── hub-utils.js             ← Formatação, arrays, DOM
│   │   ├── hub-cards.js             ← Renderização de KPIs
│   │   ├── hub-charts.js            ← Gráficos Chart.js
│   │   ├── hub-filters.js           ← Sistema de filtros
│   │   └── hub-layout.js            ← Header, footer, loading
│   │
│   └── logo.png                      ← Logo COMLURB (opcional)
│
├── dte/                              ← PAINEL DTE (NOVO)
│   ├── index.html                   ← Página principal
│   ├── data.js                      ← URL Google Sheets + metadados
│   ├── app.js                       ← Lógica de renderização
│   ├── README.md                    ← Documentação do painel
│   └── INSTALACAO.md                ← Este arquivo
│
├── pessoas/                          ← Outros painéis (exemplo)
├── sms/
├── contratos/
└── ...
```

---

## ✅ Passo a Passo - Instalação

### **1. Verifique se tem a estrutura base do HUB COMLURB**

Você precisa ter a pasta `assets/` com os componentes compartilhados:

```
hub-comlurb/
└── assets/
    ├── css/
    │   └── hub-premium.css
    └── components/
        ├── hub-utils.js
        ├── hub-cards.js
        ├── hub-charts.js
        ├── hub-filters.js
        └── hub-layout.js
```

**Se não tiver**, copie esses arquivos do repositório HUB COMLURB.

---

### **2. Crie a pasta do painel DTE**

```bash
cd hub-comlurb
mkdir dte
```

---

### **3. Copie os 4 arquivos do painel DTE**

Copie para a pasta `hub-comlurb/dte/`:

- ✅ `index.html`
- ✅ `data.js`
- ✅ `app.js`
- ✅ `README.md`

---

### **4. Verifique os caminhos relativos**

No `index.html`, os caminhos devem apontar corretamente para `assets/`:

```html
<!-- CSS do HUB -->
<link rel="stylesheet" href="../assets/css/hub-premium.css">

<!-- Componentes HUB -->
<script src="../assets/components/hub-utils.js"></script>
<script src="../assets/components/hub-cards.js"></script>
<script src="../assets/components/hub-charts.js"></script>
<script src="../assets/components/hub-filters.js"></script>
<script src="../assets/components/hub-layout.js"></script>
```

**Obs:** `../` significa "volta uma pasta" (de `dte/` para `hub-comlurb/`)

---

### **5. Configure a URL da planilha Google Sheets**

Em `data.js`, atualize a URL se necessário:

```javascript
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRbfRYtnjYlxLIPTfIpC_Q7ftJ6uUf1BK9gcZs_CSEiEnIE7qCAk_U_3_bibXftsCAf5K1uQdAPsOx/pub?output=csv";
```

**Como obter a URL:**
1. Abra a planilha no Google Sheets
2. Menu: **Arquivo > Compartilhar > Publicar na web**
3. Escolha a aba desejada
4. Formato: **CSV**
5. Copie a URL gerada

---

### **6. Teste o painel**

#### **Opção A - Servidor Web:**
```bash
# Navegue até a pasta raiz
cd hub-comlurb

# Inicie um servidor local (Python)
python -m http.server 8000

# Ou usando Node.js
npx http-server -p 8000
```

Abra: `http://localhost:8000/dte/index.html`

#### **Opção B - Arquivo Local:**
Abra diretamente: `hub-comlurb/dte/index.html` no navegador

**Obs:** Alguns recursos podem não funcionar localmente (CORS, fetch). Use um servidor web para funcionalidade completa.

---

### **7. Verifique se está funcionando**

✅ **Header** aparece com título "Painel Estratégico DTE"  
✅ **KPIs** carregam com dados da planilha  
✅ **Gráficos** renderizam corretamente  
✅ **Filtros** funcionam (ETR, Período, Tipo)  
✅ **Footer** mostra "Gabinete da Presidência"

---

## 🔧 Solução de Problemas

### **Erro: "HUB is not defined"**

**Causa:** Componentes HUB não foram carregados  
**Solução:** Verifique os caminhos no `index.html`

```html
<!-- Certifique-se que aponta para a pasta correta -->
<script src="../assets/components/hub-utils.js"></script>
```

---

### **Erro: "Failed to load CSS"**

**Causa:** CSS não encontrado  
**Solução:** Verifique o caminho do CSS

```html
<!-- Deve apontar para: hub-comlurb/assets/css/hub-premium.css -->
<link rel="stylesheet" href="../assets/css/hub-premium.css">
```

---

### **Gráficos não aparecem**

**Causa 1:** Chart.js não carregou  
**Solução:** Verifique a CDN no `index.html`

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**Causa 2:** Dados não foram processados  
**Solução:** Abra o Console (F12) e verifique erros

---

### **Dados não atualizam**

**Causa:** Navegador está usando cache  
**Solução:** Force refresh (Ctrl + Shift + R) ou limpe o cache

O painel já está configurado para **não usar cache**:
```javascript
fetch(DATA_URL, { 
  cache: "no-store",
  headers: {
    'Cache-Control': 'no-cache'
  }
});
```

---

### **Planilha retorna erro 404**

**Causa:** URL incorreta ou planilha não está publicada  
**Solução:**  
1. Verifique se a planilha está publicada como CSV
2. Copie novamente a URL de publicação
3. Cole no `data.js`

---

## 📊 Atualização Mensal da Planilha

### **Como atualizar os dados:**

1. ✅ **Abra a planilha** Google Sheets da DTE
2. ✅ **Adicione os novos dados** do mês (nova coluna)
3. ✅ **Salve** (Google Sheets salva automaticamente)
4. ✅ **Pronto!** O painel lerá automaticamente

**Não precisa:**
- ❌ Republicar a planilha
- ❌ Mudar a URL
- ❌ Mexer no código HTML/JS
- ❌ Fazer deploy novamente

---

## 🎯 Checklist Final

Antes de colocar em produção, verifique:

- [ ] Estrutura de pastas está correta
- [ ] Todos os componentes HUB estão na pasta `assets/`
- [ ] URL da planilha está correta em `data.js`
- [ ] Painel carrega sem erros no console
- [ ] KPIs mostram dados reais
- [ ] Gráficos renderizam corretamente
- [ ] Filtros funcionam
- [ ] Footer institucional aparece
- [ ] Responsividade funciona (mobile/tablet)
- [ ] Planilha está configurada para atualização mensal

---

## 📞 Suporte

Para dúvidas técnicas:
- Verifique o `README.md` na pasta do painel
- Consulte documentação dos componentes em `assets/components/`
- Contate o Núcleo de Inteligência e Gestão Estratégica Operacional

---

**Versão:** 1.0  
**Atualizado:** Maio 2025  
**HUB COMLURB** • Gabinete da Presidência
