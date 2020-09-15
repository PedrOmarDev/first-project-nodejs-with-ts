import Transaction from '../models/Transaction';

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    balance.income = this.transactions.reduce(
      (accumulator, currentValue) =>
        currentValue.type === 'income'
          ? accumulator + currentValue.value
          : accumulator,
      0,
    );

    balance.outcome = this.transactions.reduce(
      (accumulator, currentValue) =>
        currentValue.type === 'outcome'
          ? accumulator + currentValue.value
          : accumulator,
      0,
    );

    balance.total = this.transactions.reduce(
      (accumulator, currentValue) =>
        currentValue.type === 'income'
          ? accumulator + currentValue.value
          : accumulator - currentValue.value,
      0,
    );

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    if (type === 'outcome') {
      const balance = this.getBalance();
      if (balance.total < value) {
        throw Error(
          'O valor enviado extrapola total que o usuário tem em caixa',
        );
      }
    }

    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
