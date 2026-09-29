import React, { useMemo, useState } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, BarChart3, Bell, CalendarDays, ChevronLeft,
  ChevronRight, CreditCard, DollarSign, LayoutDashboard, MessageCircle,
  MoreHorizontal, Plus, Receipt, Settings, ShoppingBag, Target, Wallet,
  Utensils, Car, Home, HeartPulse, Gamepad2, Send, Sparkles, Search,
  CircleDollarSign, Check, X
} from 'lucide-react';

const initialCards = [
  { id: 1, name: 'Nubank', bank: 'Nubank', limit: 5000, used: 1260.40, closing: 5, due: 12, color: 'violet', active: true },
  { id: 2, name: 'Itaú', bank: 'Itaú', limit: 8000, used: 2340.00, closing: 10, due: 17, color: 'orange', active: true },
  { id: 3, name: 'Inter', bank: 'Banco Inter', limit: 3500, used: 480.90, closing: 15, due: 22, color: 'dark', active: true }
];

const initialTransactions = [
  { id: 1, title: 'Supermercado', category: 'Alimentação', date: '28/09', amount: -186.40, method: 'Nubank', icon: Utensils },
  { id: 2, title: 'Salário', category: 'Renda', date: '27/09', amount: 5200, method: 'Conta', icon: ArrowDownLeft },
  { id: 3, title: 'Combustível', category: 'Transporte', date: '25/09', amount: -210.00, method: 'Itaú', icon: Car },
  { id: 4, title: 'Farmácia', category: 'Saúde', date: '23/09', amount: -74.90, method: 'Inter', icon: HeartPulse },
  { id: 5, title: 'Streaming', category: 'Lazer', date: '21/09', amount: -39.90, method: 'Nubank', icon: Gamepad2 }
];

const brl = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function App() {
  const [page, setPage] = useState('dashboard');
  const [cards, setCards] = useState(initialCards);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedCard, setSelectedCard] = useState(null);
  const [invoiceMonth, setInvoiceMonth] = useState('Setembro 2026');
  const [chat, setChat] = useState([
    { from: 'bot', text: 'Olá! Sou seu Chat Financeiro. Você pode me contar uma compra, perguntar sobre suas faturas ou consultar seus gastos.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showTransaction, setShowTransaction] = useState(false);

  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const balance = income - expenses;

  const currentCard = selectedCard ? cards.find(c => c.id === selectedCard) : null;

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChat(c => [...c, { from: 'user', text }]);
    setChatInput('');
    const lower = text.toLowerCase();
    let reply = 'Entendi. Posso registrar compras, consultar gastos e acompanhar suas faturas. Para uma compra no cartão, informe valor, cartão e número de parcelas.';
    if (lower.includes('fatura')) reply = 'Sua fatura atual soma R$ 4.081,30 nos cartões cadastrados. Posso abrir uma fatura específica se você quiser.';
    if (lower.includes('alimentação') || lower.includes('alimentacao')) reply = 'Neste mês, seus lançamentos de alimentação registrados até agora somam R$ 186,40.';
    if (lower.includes('quanto') && lower.includes('gastei')) reply = 'Até agora, você registrou R$ 511,20 em despesas neste mês.';
    if (lower.includes('comprei') || lower.includes('paguei') || lower.includes('gastei')) {
      reply = 'Posso registrar isso. Identifiquei uma nova movimentação, mas preciso confirmar o cartão/conta e, se houver, o número de parcelas.';
    }
    setTimeout(() => setChat(c => [...c, { from: 'bot', text: reply }]), 250);
  };

  const addDemoTransaction = () => {
    setTransactions(t => [
      { id: Date.now(), title: 'Nova compra', category: 'Outros', date: '29/09', amount: -100, method: 'Nubank', icon: ShoppingBag },
      ...t
    ]);
    setShowTransaction(false);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">F</div><span>Finanças</span></div>
        <div className="profile"><div className="avatar">LH</div><div><strong>Meu controle</strong><small>Conta pessoal</small></div></div>
        <nav>
          <NavItem icon={LayoutDashboard} label="Visão geral" active={page === 'dashboard'} onClick={() => setPage('dashboard')} />
          <NavItem icon={CreditCard} label="Cartões" active={page === 'cards'} onClick={() => setPage('cards')} badge={cards.length} />
          <NavItem icon={Receipt} label="Lançamentos" active={page === 'transactions'} onClick={() => setPage('transactions')} />
          <NavItem icon={Wallet} label="Contas" active={page === 'accounts'} onClick={() => setPage('accounts')} />
          <NavItem icon={BarChart3} label="Relatórios" active={page === 'reports'} onClick={() => setPage('reports')} />
          <NavItem icon={Target} label="Metas" active={page === 'goals'} onClick={() => setPage('goals')} />
          <NavItem icon={MessageCircle} label="Chat Financeiro" active={page === 'chat'} onClick={() => setPage('chat')} />
        </nav>
        <div className="sidebar-bottom"><NavItem icon={Settings} label="Configurações" /><div className="security"><Check size={14}/> Dados somente seus</div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="eyebrow">SETEMBRO 2026</span><h1>{pageTitle(page, currentCard)}</h1></div>
          <div className="top-actions"><button className="icon-btn"><Search size={19}/></button><button className="icon-btn"><Bell size={19}/></button><button className="primary" onClick={() => setShowTransaction(true)}><Plus size={18}/> Novo lançamento</button></div>
        </header>

        {page === 'dashboard' && <Dashboard balance={balance} income={income} expenses={expenses} cards={cards} transactions={transactions} setPage={setPage} setSelectedCard={setSelectedCard} />}
        {page === 'cards' && <Cards cards={cards} setCards={setCards} onOpen={id => { setSelectedCard(id); setPage('invoice'); }} />}
        {page === 'invoice' && currentCard && <Invoice card={currentCard} month={invoiceMonth} setMonth={setInvoiceMonth} onBack={() => { setSelectedCard(null); setPage('cards'); }} />}
        {page === 'transactions' && <Transactions transactions={transactions} />}
        {page === 'accounts' && <Accounts />}
        {page === 'reports' && <Reports transactions={transactions} />}
        {page === 'goals' && <Goals />}
        {page === 'chat' && <Chat chat={chat} input={chatInput} setInput={setChatInput} send={sendChat} />}
      </main>

      {showTransaction && <TransactionModal close={() => setShowTransaction(false)} save={addDemoTransaction} />}
    </div>
  );
}

function pageTitle(page, card) {
  if (page === 'invoice') return card?.name ? `Fatura • ${card.name}` : 'Fatura';
  return ({ dashboard: 'Visão geral', cards: 'Meus cartões', transactions: 'Lançamentos', accounts: 'Contas', reports: 'Relatórios', goals: 'Metas financeiras', chat: 'Chat Financeiro' })[page] || 'Finanças';
}

function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><Icon size={19}/><span>{label}</span>{badge && <em>{badge}</em>}</button>;
}

function Dashboard({ balance, income, expenses, cards, transactions, setPage, setSelectedCard }) {
  return <div className="content">
    <section className="hero-grid">
      <div className="balance-card"><div className="card-top"><span>Saldo disponível</span><MoreHorizontal size={20}/></div><div className="balance">{brl(balance)}</div><div className="balance-meta"><span className="positive"><ArrowUpRight size={15}/> +8,4% no mês</span><span>Atualizado agora</span></div></div>
      <Metric icon={ArrowDownLeft} label="Entradas" value={income} positive />
      <Metric icon={ArrowUpRight} label="Saídas" value={expenses} />
    </section>

    <section className="section-head"><div><h2>Cartões</h2><p>Acompanhe limite e faturas em um só lugar.</p></div><button className="text-btn" onClick={() => setPage('cards')}>Ver todos <ChevronRight size={16}/></button></section>
    <div className="cards-row">{cards.map(card => <CardMini key={card.id} card={card} onClick={() => { setSelectedCard(card.id); setPage('invoice'); }} />)}</div>

    <section className="lower-grid">
      <div className="panel"><div className="panel-head"><div><h2>Últimos lançamentos</h2><p>Movimentações recentes</p></div><button className="text-btn" onClick={() => setPage('transactions')}>Ver tudo</button></div>{transactions.slice(0, 5).map(t => <TransactionRow key={t.id} transaction={t} />)}</div>
      <div className="panel spending"><div className="panel-head"><div><h2>Gastos por categoria</h2><p>Este mês</p></div></div><div className="donut"><div><strong>R$ 511</strong><span>despesas</span></div></div><div className="legend"><span><i className="dot d1"/>Alimentação <b>36%</b></span><span><i className="dot d2"/>Transporte <b>41%</b></span><span><i className="dot d3"/>Saúde <b>15%</b></span><span><i className="dot d4"/>Outros <b>8%</b></span></div></div>
    </section>
  </div>;
}

function Metric({ icon: Icon, label, value, positive }) {
  return <div className="metric"><div className={`metric-icon ${positive ? 'green' : ''}`}><Icon size={18}/></div><div><span>{label}</span><strong>{brl(value)}</strong><small>{positive ? 'Entradas no mês' : 'Despesas no mês'}</small></div></div>;
}

function CardMini({ card, onClick }) {
  const available = card.limit - card.used;
  return <button className={`card-mini ${card.color}`} onClick={onClick}><div className="card-mini-top"><span>{card.bank}</span><span>•••• {String(card.id).padStart(4, '0')}</span></div><div className="card-chip">▰</div><div className="card-name">{card.name}</div><div className="card-limit"><span>Fatura atual <b>{brl(card.used)}</b></span><span>Disponível <b>{brl(available)}</b></span></div></button>;
}

function Cards({ cards, setCards, onOpen }) {
  return <div className="content"><div className="page-intro"><div><p className="muted">Visão consolidada</p><h2>Seus cartões</h2><p>Gerencie limites, faturas e compras parceladas.</p></div><button className="primary"><Plus size={18}/> Adicionar cartão</button></div><div className="cards-grid">{cards.map(c => <div className="card-column" key={c.id}><CardMini card={c} onClick={() => onOpen(c.id)} /><div className="card-info"><span>Fechamento <b>dia {c.closing}</b></span><span>Vencimento <b>dia {c.due}</b></span><button onClick={() => onOpen(c.id)}>Ver fatura <ChevronRight size={15}/></button></div></div>)}</div><div className="info-banner"><CircleDollarSign size={21}/><div><strong>Compras parceladas automáticas</strong><p>Ao registrar uma compra no cartão, as parcelas serão distribuídas nas próximas faturas conforme o fechamento.</p></div></div></div>;
}

function Invoice({ card, month, setMonth, onBack }) {
  const invoiceTotal = card.used;
  const items = [
    ['Supermercado', '28/09', 186.40, '1/1'],
    ['Pneu de carro', '26/09', 300, '1/2'],
    ['Pneu de carro', '—', 300, '2/2'],
    ['Streaming', '21/09', 39.90, '1/1'],
    ['Restaurante', '19/09', 84.50, '1/1'],
    ['Eletrônicos', '16/09', 349.60, '1/3']
  ];
  return <div className="content"><button className="back-btn" onClick={onBack}><ChevronLeft size={17}/> Voltar para cartões</button><div className="invoice-hero"><div><span className="muted">FATURA ATUAL</span><h2>{brl(invoiceTotal)}</h2><div className="invoice-dates"><span>Fecha em <b>05/10/2026</b></span><span>Vence em <b>12/10/2026</b></span></div></div><button className="pay-btn">Pagar fatura</button></div><div className="invoice-stats"><div><span>Limite total</span><b>{brl(card.limit)}</b></div><div><span>Limite usado</span><b>{brl(card.used)}</b></div><div><span>Disponível</span><b>{brl(card.limit-card.used)}</b></div></div><div className="month-nav"><button onClick={() => setMonth('Agosto 2026')}><ChevronLeft/></button><strong>{month}</strong><button onClick={() => setMonth('Outubro 2026')}><ChevronRight/></button></div><div className="panel"><div className="panel-head"><div><h2>Lançamentos da fatura</h2><p>Compras e parcelas deste ciclo</p></div><span className="pill">Em aberto</span></div>{items.map((i, idx) => <div className="invoice-row" key={idx}><div className="invoice-icon"><ShoppingBag size={17}/></div><div className="invoice-desc"><strong>{i[0]}</strong><span>{i[1]} · parcela {i[3]}</span></div><b>{brl(i[2])}</b></div>)}</div></div>;
}

function Transactions({ transactions }) {
  return <div className="content"><div className="page-intro"><div><p className="muted">Histórico financeiro</p><h2>Todos os lançamentos</h2><p>Entradas e saídas da sua vida financeira.</p></div><button className="primary"><Plus size={18}/> Novo lançamento</button></div><div className="panel">{transactions.concat([{ id: 99, title: 'Aluguel', category: 'Moradia', date: '10/09', amount: -1200, method: 'Conta', icon: Home }]).map(t => <TransactionRow key={t.id} transaction={t} />)}</div></div>;
}

function TransactionRow({ transaction: t }) {
  const Icon = t.icon || ShoppingBag;
  return <div className="transaction-row"><div className="transaction-icon"><Icon size={17}/></div><div className="transaction-main"><strong>{t.title}</strong><span>{t.category} · {t.date}</span></div><span className="transaction-method">{t.method}</span><b className={t.amount > 0 ? 'amount-positive' : ''}>{t.amount > 0 ? '+' : ''}{brl(t.amount)}</b></div>;
}

function Accounts() {
  return <div className="content"><div className="page-intro"><div><p className="muted">Dinheiro e bancos</p><h2>Contas</h2><p>Contas correntes, dinheiro em espécie e outros saldos.</p></div><button className="primary"><Plus size={18}/> Nova conta</button></div><div className="accounts-grid"><div className="account-card"><div className="account-icon"><Wallet/></div><div><span>Conta principal</span><strong>R$ 3.718,70</strong><small>Conta corrente</small></div><MoreHorizontal/></div><div className="account-card"><div className="account-icon cash"><DollarSign/></div><div><span>Dinheiro</span><strong>R$ 450,00</strong><small>Carteira</small></div><MoreHorizontal/></div></div></div>;
}

function Reports({ transactions }) {
  const bars = [34, 48, 42, 62, 54, 72, 58, 78, 66, 88, 74, 92];
  return <div className="content"><div className="page-intro"><div><p className="muted">Análise</p><h2>Relatórios</h2><p>Entenda para onde seu dinheiro está indo.</p></div><button className="filter-btn"><CalendarDays size={17}/> Este mês</button></div><div className="report-grid"><div className="panel chart-panel"><div className="panel-head"><div><h2>Entradas x saídas</h2><p>Evolução ao longo do ano</p></div></div><div className="bars">{bars.map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div><div className="chart-labels">{['Out','Nov','Dez','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set'].map(x=><span key={x}>{x}</span>)}</div></div><div className="panel"><div className="panel-head"><div><h2>Categorias</h2><p>Participação nas despesas</p></div></div><div className="category-list"><Category name="Transporte" pct="41%" value="R$ 210,00" icon={Car}/><Category name="Alimentação" pct="36%" value="R$ 186,40" icon={Utensils}/><Category name="Saúde" pct="15%" value="R$ 74,90" icon={HeartPulse}/><Category name="Lazer" pct="8%" value="R$ 39,90" icon={Gamepad2}/></div></div></div></div>;
}

function Category({ name, pct, value, icon: Icon }) { return <div className="category-row"><div className="cat-icon"><Icon size={17}/></div><div><strong>{name}</strong><span>{value}</span></div><b>{pct}</b></div>; }

function Goals() {
  return <div className="content"><div className="page-intro"><div><p className="muted">Planejamento</p><h2>Metas financeiras</h2><p>Transforme seus objetivos em planos concretos.</p></div><button className="primary"><Plus size={18}/> Nova meta</button></div><div className="goal-card"><div className="goal-icon"><Target/></div><div className="goal-copy"><span>Reserva de emergência</span><strong>R$ 6.800 <small>de R$ 10.000</small></strong><div className="progress"><i style={{width:'68%'}}/></div><small>68% concluído</small></div><div className="goal-percent">68%</div></div></div>;
}

function Chat({ chat, input, setInput, send }) {
  return <div className="content chat-page"><div className="chat-shell"><div className="chat-header"><div className="chat-avatar"><Sparkles size={20}/></div><div><strong>Chat Financeiro</strong><span>Assistente para seus lançamentos e faturas</span></div><span className="online">● online</span></div><div className="chat-messages">{chat.map((m,i)=><div key={i} className={`message ${m.from}`}>{m.from === 'bot' && <div className="bot-mini"><Sparkles size={14}/></div>}<div>{m.text}</div></div>)}</div><div className="chat-suggestions"><button onClick={() => setInput('Quanto tenho de fatura este mês?')}>Fatura do mês</button><button onClick={() => setInput('Quanto gastei com alimentação este mês?')}>Gastos com alimentação</button><button onClick={() => setInput('Comprei um pneu por R$ 600 no Itaú em 2x')}>Registrar compra</button></div><div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ex.: Comprei R$ 80 no mercado no Nubank..." /><button onClick={send}><Send size={18}/></button></div></div></div>;
}

function TransactionModal({ close, save }) {
  return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="muted">NOVO</span><h2>Lançamento</h2></div><button onClick={close}><X/></button></div><div className="type-switch"><button className="selected">Despesa</button><button>Receita</button></div><label>Descrição<input placeholder="Ex.: Supermercado"/></label><div className="two"><label>Valor<input placeholder="R$ 0,00"/></label><label>Data<input type="date"/></label></div><div className="two"><label>Categoria<select><option>Alimentação</option><option>Transporte</option><option>Moradia</option><option>Saúde</option><option>Lazer</option></select></label><label>Pagamento<select><option>Nubank</option><option>Itaú</option><option>Inter</option><option>Conta</option></select></label></div><button className="primary full" onClick={save}>Salvar lançamento</button></div></div>;
}

export default App;