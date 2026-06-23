-- ============================================================
-- Script de ROLLBACK - SQL Server
-- Compatível com DBeaver
-- Gerado em: 2026-06-23
-- Referência: SCRIPT_SQL_RET.sql (gerado em 2026-06-08)
-- Objetivo: Desfazer a criação das tabelas com segurança
-- ============================================================

USE [SeuBancoDeDados]; -- 🔴 Altere para o mesmo banco usado no script original
GO

-- ============================================================
-- ATENÇÃO: Este script REMOVE permanentemente as tabelas abaixo.
-- Execute apenas em caso de necessidade de rollback.
-- Faça backup antes de executar em produção.
-- ============================================================

BEGIN TRANSACTION;
BEGIN TRY

    PRINT 'Iniciando rollback...';

    -- ============================================================
    -- 8. UploadPrescriberBenefitPrescriber
    -- ============================================================
    IF OBJECT_ID('dbo.UploadPrescriberBenefitPrescriber', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.UploadPrescriberBenefitPrescriber;
        PRINT 'Tabela UploadPrescriberBenefitPrescriber removida.';
    END
    ELSE
        PRINT 'Tabela UploadPrescriberBenefitPrescriber nao encontrada (ignorado).';

    -- ============================================================
    -- 7. UploadPrescriberBenefit
    -- ============================================================
    IF OBJECT_ID('dbo.UploadPrescriberBenefit', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.UploadPrescriberBenefit;
        PRINT 'Tabela UploadPrescriberBenefit removida.';
    END
    ELSE
        PRINT 'Tabela UploadPrescriberBenefit nao encontrada (ignorado).';

    -- ============================================================
    -- 6. UploadPrescriber
    -- ============================================================
    IF OBJECT_ID('dbo.UploadPrescriber', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.UploadPrescriber;
        PRINT 'Tabela UploadPrescriber removida.';
    END
    ELSE
        PRINT 'Tabela UploadPrescriber nao encontrada (ignorado).';

    -- ============================================================
    -- 5. PrescribersHistory
    -- ============================================================
    IF OBJECT_ID('dbo.PrescribersHistory', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.PrescribersHistory;
        PRINT 'Tabela PrescribersHistory removida.';
    END
    ELSE
        PRINT 'Tabela PrescribersHistory nao encontrada (ignorado).';

    -- ============================================================
    -- 4. PrescriberBenefitPrescriberHistory
    -- ============================================================
    IF OBJECT_ID('dbo.PrescriberBenefitPrescriberHistory', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.PrescriberBenefitPrescriberHistory;
        PRINT 'Tabela PrescriberBenefitPrescriberHistory removida.';
    END
    ELSE
        PRINT 'Tabela PrescriberBenefitPrescriberHistory nao encontrada (ignorado).';

    -- ============================================================
    -- 3. PrescriberBenefitPrescriber
    -- ============================================================
    IF OBJECT_ID('dbo.PrescriberBenefitPrescriber', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.PrescriberBenefitPrescriber;
        PRINT 'Tabela PrescriberBenefitPrescriber removida.';
    END
    ELSE
        PRINT 'Tabela PrescriberBenefitPrescriber nao encontrada (ignorado).';

    -- ============================================================
    -- 2. PrescriberBenefitHistory
    -- ============================================================
    IF OBJECT_ID('dbo.PrescriberBenefitHistory', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.PrescriberBenefitHistory;
        PRINT 'Tabela PrescriberBenefitHistory removida.';
    END
    ELSE
        PRINT 'Tabela PrescriberBenefitHistory nao encontrada (ignorado).';

    -- ============================================================
    -- 1. PrescriberBenefit
    -- ============================================================
    IF OBJECT_ID('dbo.PrescriberBenefit', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.PrescriberBenefit;
        PRINT 'Tabela PrescriberBenefit removida.';
    END
    ELSE
        PRINT 'Tabela PrescriberBenefit nao encontrada (ignorado).';

    -- ============================================================
    -- Confirma todas as operações
    -- ============================================================
    COMMIT TRANSACTION;
    PRINT '========================================';
    PRINT 'Rollback concluido com sucesso.';
    PRINT '========================================';

END TRY
BEGIN CATCH

    ROLLBACK TRANSACTION;

    PRINT '========================================';
    PRINT 'ERRO durante o rollback. Transacao revertida.';
    PRINT 'Mensagem : ' + ERROR_MESSAGE();
    PRINT 'Linha    : ' + CAST(ERROR_LINE() AS NVARCHAR(10));
    PRINT 'Numero   : ' + CAST(ERROR_NUMBER() AS NVARCHAR(10));
    PRINT '========================================';

    -- Relança o erro para o cliente (DBeaver/SSMS)
    THROW;

END CATCH;
GO

-- ============================================================
-- FIM DO SCRIPT DE ROLLBACK
-- ============================================================