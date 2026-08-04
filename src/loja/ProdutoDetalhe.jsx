import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost, fmt } from './api'
import { carregarCarrinho, salvarCarrinho } from './carrinho'
import { Estrelas } from './LojaAcessorios'
import './loja.css'

export function ProdutoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const [zoomAtivo, setZoomAtivo] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightbox, setLightbox] = useState(false)

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const [relacionados, setRelacionados] = useState([])
  const [avaliacoes, setAvaliacoes] = useState({ media: 0, total: 0, avaliacoes: [] })
  const [formAval, setFormAval] = useState({ email: '', nota: 0, comentario: '' })
  const [enviandoAval, setEnviandoAval] = useState(false)
  const [erroAval, setErroAval] = useState('')
  const [avalEnviada, setAvalEnviada] = useState(false)

  function carregarAvaliacoes() {
    apiGet(`/api/loja-acessorios/produtos/${id}/avaliacoes`).then(setAvaliacoes).catch(() => {})
  }

  useEffect(() => { carregarAvaliacoes() }, [id])

  async function enviarAvaliacao(e) {
    e.preventDefault()
    setErroAval('')
    if (!formAval.email.trim()) { setErroAval('Informe o e-mail usado na compra.'); return }
    if (!formAval.nota) { setErroAval('Escolha uma nota de 1 a 5 estrelas.'); return }
    setEnviandoAval(true)
    try {
      await apiPost('/api/loja-acessorios/produtos/avaliacoes', {
        produtoId: id,
        email: formAval.email.trim(),
        nota: formAval.nota,
        comentario: formAval.comentario.trim() || null,
      })
      setAvalEnviada(true)
      carregarAvaliacoes()
    } catch (e2) {
      setErroAval(e2.message || 'Erro ao enviar avaliação.')
    } finally {
      setEnviandoAval(false)
    }
  }

  useEffect(() => {
    setCarregando(true)
    apiGet(`/api/loja-acessorios/produtos/${id}`)
      .then(setProduto)
      .catch(() => setErro('Produto não encontrado.'))
      .finally(() => setCarregando(false))
  }, [id])

  useEffect(() => {
    if (!produto) return
    apiGet(`/api/loja-acessorios/produtos?categoria=${produto.categoria}`)
      .then(lista => setRelacionados(lista.filter(p => p.id !== produto.id).slice(0, 4)))
      .catch(() => {})
  }, [produto])

  useEffect(() => {
    if (lightbox) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [lightbox])

  if (carregando) {
    return (
      <div className="loja-page">
        <Header />
        <p className="loja-msg">Carregando produto...</p>
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="loja-page">
        <Header />
        <p className="loja-msg loja-erro">{erro || 'Produto não encontrado.'}</p>
        <div style={{ textAlign: 'center' }}>
          <Link to="/loja" className="btn-ghost">← Voltar para a loja</Link>
        </div>
      </div>
    )
  }

  const imagens = (produto.imagensUrls?.split(',').map(u => u.trim()).filter(Boolean)) ?? []
  const precoFinal = produto.precoPromocional ?? produto.preco

  function adicionarAoCarrinho() {
    const carrinho = carregarCarrinho()
    const existe = carrinho.find(i => i.produtoId === produto.id)
    const novo = existe
      ? carrinho.map(i => i.produtoId === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i)
      : [...carrinho, { produtoId: produto.id, nome: produto.nome, preco: precoFinal, quantidade }]
    salvarCarrinho(novo)
    setAdicionado(true)
  }

  return (
    <div className="loja-page">
      <Header />

      <div className="produto-detalhe-wrap">
        <Link to="/loja" className="produto-voltar">← Voltar para a loja</Link>

        <div className="produto-detalhe-grid">
          <div className="produto-galeria">
            <div
              className="produto-galeria-principal"
              onMouseEnter={() => setZoomAtivo(true)}
              onMouseLeave={() => setZoomAtivo(false)}
              onMouseMove={handleMouseMove}
              onClick={() => imagens.length > 0 && setLightbox(true)}
              style={{ cursor: imagens.length > 0 ? 'zoom-in' : 'default' }}
            >
              {imagens.length > 0 ? (
                <img
                  src={imagens[imagemAtiva]}
                  alt={produto.nome}
                  className={zoomAtivo ? 'zoom-ativo' : ''}
                  style={zoomAtivo ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                />
              ) : (
                <span className="loja-card-placeholder">📦</span>
              )}
            </div>
            {imagens.length > 1 && (
              <div className="produto-galeria-miniaturas">
                {imagens.map((url, i) => (
                  <button
                    key={i}
                    className={`produto-miniatura${i === imagemAtiva ? ' ativa' : ''}`}
                    onClick={() => setImagemAtiva(i)}
                  >
                    <img src={url} alt={`${produto.nome} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="produto-info">
            <h1>{produto.nome}</h1>
            <div className="loja-card-preco" style={{ marginTop: 8 }}>
              {produto.precoPromocional && <span className="loja-card-de">{fmt(produto.preco)}</span>}
              <span className="loja-card-por" style={{ fontSize: 28 }}>{fmt(precoFinal)}</span>
            </div>
            <p className="loja-card-parcelas" style={{ marginBottom: 16 }}>ou em até 12x no cartão de crédito</p>

            {produto.descricao && <p className="produto-descricao">{produto.descricao}</p>}

            {produto.disponivel ? (
              adicionado ? (
                <div className="produto-adicionado">
                  <p>✓ Adicionado ao carrinho!</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-ghost" onClick={() => { setAdicionado(false); setQuantidade(1) }}>Continuar comprando</button>
                    <button className="btn-primary" onClick={() => navigate('/loja?carrinho=1')}>Ver carrinho →</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="produto-qtd">
                    <span>Quantidade</span>
                    <div className="produto-qtd-controles">
                      <button onClick={() => setQuantidade(q => Math.max(1, q - 1))}>−</button>
                      <span>{quantidade}</span>
                      <button onClick={() => setQuantidade(q => q + 1)}>+</button>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={adicionarAoCarrinho}>
                    Adicionar ao carrinho
                  </button>
                </>
              )
            ) : (
              <button className="btn-ghost" disabled style={{ width: '100%', justifyContent: 'center' }}>Fora de estoque</button>
            )}
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="produto-relacionados">
            <h2>Você também pode gostar</h2>
            <div className="loja-grid" style={{ padding: 0 }}>
              {relacionados.map(p => {
                const img = p.imagensUrls?.split(',')[0]
                const preco = p.precoPromocional ?? p.preco
                return (
                  <Link key={p.id} to={`/loja/produto/${p.id}`} className="loja-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="loja-card-img">
                      {img ? <img src={img} alt={p.nome} /> : <span className="loja-card-placeholder">📦</span>}
                    </div>
                    <div className="loja-card-body">
                      <h3>{p.nome}</h3>
                      <div className="loja-card-preco">
                        {p.precoPromocional && <span className="loja-card-de">{fmt(p.preco)}</span>}
                        <span className="loja-card-por">{fmt(preco)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div className="avaliacoes-secao">
          <h2>Avaliações</h2>
          {avaliacoes.total > 0 ? (
            <div className="avaliacoes-resumo">
              <Estrelas media={avaliacoes.media} total={avaliacoes.total} tamanho={18} />
              <strong>{avaliacoes.media}</strong>
              <span style={{ color: 'var(--text-3)', fontSize: 13 }}>de 5 · {avaliacoes.total} avaliação(ões)</span>
            </div>
          ) : (
            <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 20 }}>Este produto ainda não tem avaliações.</p>
          )}

          {avaliacoes.avaliacoes.map(a => (
            <div key={a.id} className="avaliacao-item">
              <div className="avaliacao-item-topo">
                <span className="avaliacao-item-nome">{a.clienteNome}</span>
                <span className="avaliacao-item-data">{new Date(a.criadoEm).toLocaleDateString('pt-BR')}</span>
              </div>
              <Estrelas media={a.nota} total={1} tamanho={13} />
              {a.comentario && <p className="avaliacao-item-comentario">{a.comentario}</p>}
            </div>
          ))}

          <div className="avaliacao-form">
            {avalEnviada ? (
              <p className="avaliacao-form-ok">✓ Avaliação enviada, obrigado!</p>
            ) : (
              <form onSubmit={enviarAvaliacao}>
                <h3>Já comprou? Deixe sua avaliação</h3>
                <div className="avaliacao-form-estrelas">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button"
                      className={n <= formAval.nota ? 'selecionada' : ''}
                      onClick={() => setFormAval(f => ({ ...f, nota: n }))}>★</button>
                  ))}
                </div>
                <input
                  type="email" placeholder="E-mail usado na compra"
                  value={formAval.email}
                  onChange={e => setFormAval(f => ({ ...f, email: e.target.value }))}
                  style={{ marginBottom: 12 }}
                />
                <textarea
                  placeholder="Comentário (opcional)"
                  value={formAval.comentario}
                  onChange={e => setFormAval(f => ({ ...f, comentario: e.target.value }))}
                />
                {erroAval && <p className="checkout-erro" style={{ marginBottom: 12 }}>{erroAval}</p>}
                <button type="submit" className="btn-primary" disabled={enviandoAval}>
                  {enviandoAval ? 'Enviando...' : 'Enviar avaliação'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {lightbox && imagens.length > 0 && (
        <div className="loja-lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="loja-lightbox-fechar" onClick={() => setLightbox(false)}>✕</button>
          <img src={imagens[imagemAtiva]} alt={produto.nome} className="loja-lightbox-img" onClick={e => e.stopPropagation()} />
          {imagens.length > 1 && (
            <div className="loja-lightbox-miniaturas" onClick={e => e.stopPropagation()}>
              {imagens.map((url, i) => (
                <button
                  key={i}
                  className={`produto-miniatura${i === imagemAtiva ? ' ativa' : ''}`}
                  onClick={() => setImagemAtiva(i)}
                >
                  <img src={url} alt={`${produto.nome} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Header() {
  return (
    <header className="loja-header">
      <Link to="/" className="loja-logo">
        <img src="/logo-aldevsoftware-padrao.png" alt="AL Dev Software" className="nav-logo-mark" />
        AL Dev Software
      </Link>
      <Link to="/loja" className="loja-carrinho-btn">🛒 Ver loja</Link>
    </header>
  )
}