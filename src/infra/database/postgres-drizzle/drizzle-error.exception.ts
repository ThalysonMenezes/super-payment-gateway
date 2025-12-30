import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError } from 'pg';

interface Context {
  table: string;
  method: string;
  operation: 'insert' | 'update' | 'delete' | 'select';
}

interface Metadata extends Context {
  constraint?: string;
  code?: string;
  error?: string;
  message?: string;
}

export class DrizzleErrorHandling {
  private static _props: Metadata;
  private static readonly pgErrors08 = {
    //Connection Exception
    '08000': 'Erro geral de conexão com o banco de dados.',
    '08001': 'Não foi possível estabelecer conexão com o banco de dados.',
    '08003': 'Conexão inexistente.',
    '08004': 'Conexão recusada pelo servidor.',
    '08006': 'Falha na conexão com o banco de dados.',
    '08007': 'Falha ao estabelecer transação.',
  };
  private static readonly pgErrors22 = {
    // Data Exception
    '22001': 'Valor muito longo para o tipo de dado.',
    '22002': 'Valor nulo não permitido.',
    '22003': 'Valor numérico fora do intervalo permitido.',
    '22004': 'Valor nulo inválido.',
    '22007': 'Formato de data/hora inválido.',
    '22008': 'Overflow de data/hora.',
    '22P02': 'Formato de entrada inválido para o tipo de dado.',
    '22P05': 'Caractere inválido no valor informado.',
  };
  private static readonly pgErrors23 = {
    // Integrity Constraint Violation
    '23000': 'Violação de restrição de integridade.',
    '23502': 'Campo obrigatório não pode ser nulo.',
    '23503': 'Violação de chave estrangeira.',
    '23505': 'Valor duplicado viola restrição de unicidade.',
    '23514': 'Violação de regra de validação (CHECK constraint).',
  };
  private static readonly pgErrors28 = {
    // Invalid Authorization Specification
    '28000': 'Permissão negada para acessar o banco de dados.',
    '28P01': 'Usuário ou senha inválidos.',
  };
  private static readonly pgErrors40 = {
    // Transaction Rollback
    '40000': 'Transação abortada.',
    '40001': 'Falha de serialização da transação.',
    '40P01': 'Deadlock detectado. A transação foi cancelada.',
  };
  private static readonly pgErrors42 = {
    //Syntax Error or Access Rule Violation
    '42601': 'Erro de sintaxe na consulta SQL.',
    '42701': 'A coluna informada já existe.',
    '42703': 'A coluna informada não existe.',
    '42710': 'O objeto já existe no banco de dados.',
    '42P01': 'A tabela ou view informada não existe ou não está acessível no schema atual.',
    '42P02': 'Parâmetro informado não existe ou não foi definido corretamente.',
    '42P03': 'Cursor duplicado já existe.',
    '42P04': 'Já existe um banco de dados com esse nome.',
    '42P05': 'Já existe uma prepared statement com esse nome.',
    '42P06': 'O schema informado já existe.',
    '42P07': 'A tabela informada já existe.',
    '42P08': 'Parâmetro ambíguo na consulta SQL.',
    '42P09': 'Alias ambíguo na consulta SQL.',
    '42P10': 'Referência inválida a coluna.',
    '42P11': 'Definição de cursor inválida.',
    '42P12': 'Definição de banco de dados inválida.',
    '42P13': 'Definição de função inválida.',
    '42P14': 'Definição de prepared statement inválida.',
    '42P15': 'Definição de schema inválida.',
    '42P16': 'Definição de tabela inválida.',
  };
  private static readonly pgErrors53 = {
    // Insufficient Resources
    '53000': 'Recursos insuficientes no servidor.',
    '53100': 'Espaço em disco insuficiente.',
    '53200': 'Memória insuficiente para executar a operação.',
    '53300': 'Número máximo de conexões excedido.',
  };
  private static readonly pgErrors57 = {
    //Operator Intervention
    '57014': 'Consulta cancelada pelo sistema ou pelo usuário.',
    '57P01': 'Servidor está sendo desligado.',
    '57P02': 'Servidor foi finalizado inesperadamente.',
    '57P03': 'Servidor ainda está iniciando.',
  };
  private static readonly pgErrors58 = {
    // System Error
    '58000': 'Erro interno do sistema do banco de dados.',
    '58030': 'Erro de entrada/saída no sistema de arquivos.',
  };

  private static getCodeError(code?: string) {
    if (!code) return null;

    const errors = {
      ...this.pgErrors08,
      ...this.pgErrors22,
      ...this.pgErrors23,
      ...this.pgErrors28,
      ...this.pgErrors40,
      ...this.pgErrors42,
      ...this.pgErrors53,
      ...this.pgErrors57,
      ...this.pgErrors58,
    };

    return errors[code] || null;
  }

  public static context(ctx: Context) {
    this._props = ctx;
    return (e: any): never => {
      this.handle(e);
      throw new Error('Database error.');
    };
  }

  private static handle(e: any) {
    if (!(e instanceof DrizzleQueryError)) {
      this.notDrizzleQueryError(e);
    }

    if (e.cause instanceof DatabaseError) {
      this.isDatabaseError(e.cause);
    } else {
      this.notDatabaseError(e);
    }
  }

  private static notDrizzleQueryError(e: any) {
    console.log('[error]', e);
    console.log('[metadata]', this._props);
  }

  private static notDatabaseError(e: any) {
    const cause = e.cause as any;

    if (cause.code === 'ECONNREFUSED') {
      this._props.code = cause.code;
      this._props.error = cause.message;
      this._props.message = 'Erro ao se conectar com o Banco de Dados';
    } else {
      console.log('[notDatabaseError]', e);
    }

    console.log('[metadata]', this._props);
  }

  private static isDatabaseError(cause: DatabaseError) {
    const { code, message, constraint } = cause;

    this._props.code = code;
    this._props.error = message;
    this._props.message = this.getCodeError(code);
    if (constraint) this._props.constraint = constraint;

    console.log('[metadata]', this._props);
  }
}
