# 🏥 Painel SMS - Limpeza Hospitalar

Sistema de monitoramento e gestão dos contratos de limpeza em unidades de saúde da COMLURB.

---

## 📊 DADOS INTEGRADOS

### Hospitais Ativos (3)
1. **Hospital Municipal Miguel Couto (HMMC)**
   - Efetivo: 111 garis
   - Receita Mensal: R$ 1.260.796
   - Containers: 45 (30 RSS)
   - Coordenadas: -22.9945, -43.2769

2. **Hospital Municipal Salgado Filho (HMSF)**
   - Efetivo: 106 garis
   - Receita Mensal: R$ 1.201.051
   - Containers: 42 (28 RSS)
   - Coordenadas: -22.8964, -43.3087

3. **Hospital Municipal Lourenço Jorge + Leila Diniz (HMLJ/LD)**
   - Efetivo: 145 garis
   - Receita Mensal: R$ 1.576.412
   - Containers: 58 (38 RSS)
   - Coordenadas: -23.0125, -43.3089

### Totais
- **Unidades Ativas:** 3
- **Efetivo Operacional:** 362 garis
- **Receita Mensal:** R$ 4.038.260
- **Containers Total:** 145 unidades
- **Containers RSS:** 96 unidades
- **Faturamento Acumulado (Jan/24 - Mai/25):** R$ 68,65 milhões

### Observações
- **Hospital Municipal Pedro II (Gazolla)** saiu do contrato em meados de 2024
- Contratos vigentes até **01/01/2028**
- Reajuste: **Bienal**

---

## 🎯 ESTRUTURA DO PAINEL

### Tela 1: Visão Executiva
- 5 KPIs principais
- Gráfico de faturamento mensal por hospital (2024-2025)
- Card com resumo contratual
- Mapa com localização das unidades

### Tela 2: Estrutura Contratual
- Cards detalhados de cada hospital ativo
- Informações contratuais completas
- Seção de unidades inativas

### Tela 3: Territorial
- Resumo com 3 indicadores territoriais
- Mapa interativo com marcadores numerados
- Ranking de unidades por efetivo operacional

---

## 🚀 COMO USAR

### 1. Upload no GitHub
```bash
# Clone o repositório
git clone https://github.com/urbanflowrio/HUB_COMLURB.git

# Copie a pasta sms/ para o repositório
cp -r sms/ HUB_COMLURB/

# Commit e push
cd HUB_COMLURB
git add sms/
git commit -m "Adiciona Painel SMS - Limpeza Hospitalar"
git push origin main
```

### 2. Acesse o Painel
```
https://urbanflowrio.github.io/HUB_COMLURB/sms/
```

---

## 🛠️ TECNOLOGIAS

- **HTML5** - Estrutura
- **CSS3** - Estilização responsiva
- **JavaScript** - Lógica e interatividade
- **Chart.js** - Gráficos interativos
- **Leaflet.js** - Mapas interativos
- **Google Sheets API** - Atualização de dados (futuro)

---

## 📁 ARQUIVOS

```
sms/
├── index.html      # Estrutura HTML + CSS embutido
├── data.js         # Dados dos hospitais e faturamento
├── screens.js      # Renderização das 3 telas
├── app.js          # Navegação e inicialização
└── README.md       # Documentação
```

---

## 🔄 ATUALIZAÇÕES FUTURAS

- [ ] Integração com Google Sheets para containers
- [ ] Dashboard de indicadores operacionais em tempo real
- [ ] Filtros por período de faturamento
- [ ] Exportação de relatórios em PDF
- [ ] Alertas de vencimento contratual
- [ ] Histórico de reajustes

---

## 📞 SUPORTE

**Desenvolvido por:** Urban Flow  
**Para:** COMLURB - Companhia Municipal de Limpeza Urbana  
**Projeto:** HUB de Contratos e Gestão Operacional

---

## 📝 CHANGELOG

### Versão 1.0 (Maio 2025)
- ✅ Visão Executiva com KPIs
- ✅ Gráfico de faturamento histórico
- ✅ Estrutura Contratual detalhada
- ✅ Visão Territorial com mapas
- ✅ Ranking de unidades
- ✅ Design responsivo

---

**Última atualização:** 15/05/2026
