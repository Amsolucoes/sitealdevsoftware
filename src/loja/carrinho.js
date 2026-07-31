const CHAVE = 'aldev:carrinho-acessorios'

export function carregarCarrinho() {
  try {
    const raw = localStorage.getItem(CHAVE)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE, JSON.stringify(itens))
}