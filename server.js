const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const HTTPS_PORT = 8443; // Porta HTTPS

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para servir o arquivo webrtc.html
app.get('/webrtc', (req, res) => {
    res.sendFile(path.join(__dirname, 'webrtc.html'));
});

// Rota para criar um arquivo
app.post('/criar-arquivo', (req, res) => {
    const { nomeArquivo, conteudo } = req.body;

    if (!nomeArquivo || !conteudo) {
        return res.status(400).json({ mensagem: 'Nome do arquivo e conteúdo são obrigatórios!' });
    }

    // Caminho onde o arquivo será salvo
    const caminhoArquivo = path.join(__dirname, nomeArquivo);

    // Escreve o arquivo no sistema de arquivos
    fs.writeFile(caminhoArquivo, conteudo, (err) => {
        if (err) {
            console.error('Erro ao criar o arquivo:', err);
            return res.status(500).json({ mensagem: 'Erro ao criar o arquivo.' });
        }

        console.log(`Arquivo "${nomeArquivo}" criado com sucesso!`);
        res.status(200).json({ mensagem: `Arquivo "${nomeArquivo}" criado com sucesso!` });
    });
});

// Carrega o certificado e a chave privada
const options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

// Cria o servidor HTTPS com o app do Express
https.createServer(options, app).listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`Servidor HTTPS rodando na porta ${HTTPS_PORT}`);
});
