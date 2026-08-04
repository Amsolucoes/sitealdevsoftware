import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { apiGet, fmt } from './api'
import { carregarCarrinho, salvarCarrinho } from './carrinho'
import './loja.css'

export function Estrelas({ media, total, tamanho = 13 }) {
  if (!total) return null
  const cheias = Math.round(media)
  return (
    <div className="loja-estrelas" style={{ fontSize: tamanho }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= cheias ? 'estrela-cheia' : 'estrela-vazia'}>★</span>
      ))}
      <span className="loja-estrelas-total">({total})</span>
    </div>
  )
}

export function LojaAcessorios() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [carrinho, setCarrinho] = useState(carregarCarrinho())
  const [mostrarCarrinho, setMostrarCarrinho] = useState(searchParams.get('carrinho') === '1')
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState('')

  useEffect(() => {
    apiGet('/api/loja-acessorios/produtos')
      .then(setProdutos)
      .catch(() => setErro('Não foi possível carregar os produtos agora.'))
      .finally(() => setCarregando(false))
    apiGet('/api/loja-acessorios/produtos/categorias')
      .then(setCategorias)
      .catch(() => {})
  }, [])

  function labelCategoria(chave) {
    return categorias.find(c => c.chave === chave)?.nome ?? chave
  }

  const produtosFiltrados = produtos
    .filter(p => !categoriaAtiva || p.categoria === categoriaAtiva)
    .filter(p => {
      if (!busca.trim()) return true
      const termo = busca.toLowerCase()
      return (p.descricao ?? '').toLowerCase().includes(termo) ||
             labelCategoria(p.categoria).toLowerCase().includes(termo)
    })

  function adicionarAoCarrinho(produto) {
    setCarrinho(prev => {
      const existe = prev.find(i => i.produtoId === produto.id)
      const novo = existe
        ? prev.map(i => i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i)
        : [...prev, {
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.precoPromocional ?? produto.preco,
            quantidade: 1,
          }]
      salvarCarrinho(novo)
      return novo
    })
    setMostrarCarrinho(true)
  }

  function alterarQtd(produtoId, delta) {
    setCarrinho(prev => {
      const novo = prev
        .map(i => i.produtoId === produtoId ? { ...i, quantidade: i.quantidade + delta } : i)
        .filter(i => i.quantidade > 0)
      salvarCarrinho(novo)
      return novo
    })
  }

  function removerItem(produtoId) {
    setCarrinho(prev => {
      const novo = prev.filter(i => i.produtoId !== produtoId)
      salvarCarrinho(novo)
      return novo
    })
  }

  const totalCarrinho = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0)
  const qtdCarrinho = carrinho.reduce((s, i) => s + i.quantidade, 0)

  function irParaCheckout() {
    if (carrinho.length === 0) return
    navigate('/loja/checkout')
  }

  return (
    <div className="loja-page">
      <header className="loja-header">
        <a href="/" className="loja-logo">
          <img src="/logo-aldevsoftware-padrao.png" alt="AL Dev Software" className="nav-logo-mark" />
          AL Dev Software
        </a>
        <button className="loja-carrinho-btn" onClick={() => setMostrarCarrinho(v => !v)}>
          🛒 Carrinho {qtdCarrinho > 0 && <span className="loja-carrinho-badge">{qtdCarrinho}</span>}
        </button>
      </header>

      <div className="loja-hero">
        <h1>Acessórios para o seu negócio</h1>
        <p>Leitor de código de barras, impressora fiscal e impressora de etiquetas — compatíveis com o sistema.</p>
        <div className="loja-busca-wrap">
          <input
            className="loja-busca-input"
            placeholder="Buscar por descrição ou categoria..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        {categorias.length > 0 && (
          <div className="loja-chips-wrap">
            <button
              className={`loja-chip${categoriaAtiva === '' ? ' ativo' : ''}`}
              onClick={() => setCategoriaAtiva('')}>
              Todos
            </button>
            {categorias.map(c => (
              <button
                key={c.id}
                className={`loja-chip${categoriaAtiva === c.chave ? ' ativo' : ''}`}
                onClick={() => setCategoriaAtiva(c.chave)}>
                {c.nome}
              </button>
            ))}
          </div>
        )}
      </div>

      {carregando ? (
        <p className="loja-msg">Carregando produtos...</p>
      ) : erro ? (
        <p className="loja-msg loja-erro">{erro}</p>
      ) : produtos.length === 0 ? (
        <p className="loja-msg">Nenhum produto disponível no momento.</p>
      ) : produtosFiltrados.length === 0 ? (
        <p className="loja-msg">
          {busca.trim() ? `Nenhum produto encontrado para "${busca}".` : 'Nenhum produto nesta categoria.'}
        </p>
      ) : (
        <div className="loja-grid">
          {produtosFiltrados.map(p => {
            const imagem = p.imagensUrls?.split(',')[0]
            const precoFinal = p.precoPromocional ?? p.preco
            return (
              <div key={p.id} className="loja-card">
                <Link to={`/loja/produto/${p.id}`} className="loja-card-img" style={{ position: 'relative' }}>
                  {imagem ? <img src={imagem} alt={p.nome} /> : <span className="loja-card-placeholder">📦</span>}
                  {p.destaque && <span className="loja-card-badge loja-card-badge-destaque">⭐ Mais vendido</span>}
                  {!p.destaque && p.novo && <span className="loja-card-badge loja-card-badge-novo">Novo</span>}
                </Link>
                <div className="loja-card-body">
                  <Link to={`/loja/produto/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>{p.nome}</h3>
                  </Link>
                  <Estrelas media={p.mediaAvaliacoes} total={p.totalAvaliacoes} />
                  {p.descricao && <p className="loja-card-desc">{p.descricao}</p>}
                  <div className="loja-card-preco">
                    {p.precoPromocional && <span className="loja-card-de">{fmt(p.preco)}</span>}
                    <span className="loja-card-por">{fmt(precoFinal)}</span>
                  </div>
                  <p className="loja-card-parcelas">ou em até 12x no cartão</p>
                  {p.disponivel ? (
                    <button className="btn-primary" onClick={e => { e.preventDefault(); adicionarAoCarrinho(p) }}>Adicionar ao carrinho</button>
                  ) : (
                    <button className="btn-ghost" disabled>Fora de estoque</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <footer className="loja-footer">
        <div className="loja-footer-grid">
          <div className="loja-footer-col">
            <h4>Fale conosco</h4>
            <a href="https://wa.me/5567982036545" target="_blank" rel="noreferrer">📱 (67) 98203-6545</a>
          </div>
          <div className="loja-footer-col">
            <h4>Trocas e entrega</h4>
            <p>Trocas em até 7 dias após o recebimento.</p>
            <p>Entrega em até 5 dias úteis, conforme o Correios.</p>
          </div>
          <div className="loja-footer-col">
            <h4>Empresa</h4>
            <p>AL Dev Software</p>
            <p>MEI: 66.783.439/0001-46</p>
          </div>
        </div>
        <div className="loja-footer-bottom">
          © {new Date().getFullYear()} AL Dev Software. Todos os direitos reservados.
        </div>
      </footer>

      {mostrarCarrinho && (
        <div className="loja-carrinho-overlay" onClick={e => e.target === e.currentTarget && setMostrarCarrinho(false)}>
          <div className="loja-carrinho-painel">
            <div className="loja-carrinho-head">
              <h2>Seu carrinho</h2>
              <button className="loja-fechar" onClick={() => setMostrarCarrinho(false)}>✕</button>
            </div>
            {carrinho.length === 0 ? (
              <p className="loja-msg">Seu carrinho está vazio.</p>
            ) : (
              <>
                <div className="loja-carrinho-itens">
                  {carrinho.map(i => (
                    <div key={i.produtoId} className="loja-carrinho-item">
                      <div className="loja-carrinho-item-info">
                        <span className="nome">{i.nome}</span>
                        <span className="preco">{fmt(i.preco)}</span>
                      </div>
                      <div className="loja-carrinho-item-acoes">
                        <button onClick={() => alterarQtd(i.produtoId, -1)}>−</button>
                        <span>{i.quantidade}</span>
                        <button onClick={() => alterarQtd(i.produtoId, 1)}>+</button>
                        <button className="loja-remover" onClick={() => removerItem(i.produtoId)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="loja-carrinho-total">
                  <span>Subtotal</span>
                  <strong>{fmt(totalCarrinho)}</strong>
                </div>
                <p className="loja-frete-aviso">O frete é calculado na próxima etapa.</p>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={irParaCheckout}>
                  Finalizar compra →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}