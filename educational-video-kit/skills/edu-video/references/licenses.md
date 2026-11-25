# Voz, render e uso comercial

Verificação em 2026-10-12. A pipeline usa processamento local e não chama SaaS. Os termos do motor e de cada voz são distintos.

- [Piper atual](https://github.com/OHF-Voice/piper1-gpl): GPL-3.0. Permite uso comercial; redistribuir o motor/modificações exige cumprir GPL. A saída de um programa não herda automaticamente a GPL ([FAQ da FSF](https://www.gnu.org/licenses/gpl-faq.html#GPLOutput)). Não distribuímos binaries no Git.
- [pt_BR-faber-medium MODEL_CARD](https://huggingface.co/rhasspy/piper-voices/blob/main/pt/pt_BR/faber/medium/MODEL_CARD): português brasileiro, 22.050 Hz, dataset CC0; ajuste a partir de lessac medium. O repositório de vozes declara MIT. [CC0](https://creativecommons.org/publicdomain/zero/1.0/) permite uso inclusive comercial, sem atribuição obrigatória por copyright; não concede direitos de marca/endosso e não autoriza falsa identificação da voz como pessoa real.
- [lessac medium](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/lessac/medium/MODEL_CARD): consulte o card antes de escolher inglês. Inglês é configurável, mas não foi sintetizado nesta validação.
- FFmpeg/libx264: uso local gratuito; redistribuição de binaries exige observar as respectivas licenças. Pacotes/modelos são ignorados pelo Git e instalados na máquina.
- Não usar imagens de agências como se todos os direitos fossem iguais: leia licença/crédito de cada asset. A demo contém só diagramas próprios, nenhum clipe ou imagem astronômica externa.

O card Faber consultado está preservado na raiz do KIT. Setup baixa cards e registra hashes, mas uma voz diferente ou card atualizado exige nova revisão. Um fornecedor pago pode separar plano gratuito, licença comercial e direitos de saída: valide os três antes da chamada. Este kit não exige uma conta nem credencial.
