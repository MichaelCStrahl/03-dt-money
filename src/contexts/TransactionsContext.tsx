import { type ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transactions {
	id: number;
	description: string;
	price: number;
	type: "income" | "outcome";
	category: string;
}

interface TransactionContextType {
	transactions: Transactions[];
	fetchTransactions: (query?: string) => Promise<void>;
	createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
	children: ReactNode;
}

interface CreateTransactionInput {
	category: string;
	description: string;
	price: number;
	type: "income" | "outcome";
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
	const [transactions, setTransactions] = useState<Transactions[]>([]);

	const fetchTransactions = async (query?: string) => {
		const response = await api.get("transactions", {
			params: {
				_sort: "createdAt",
				_order: "desc",
				q: query,
			},
		});

		setTransactions(response.data);
	};

	const createTransaction = async (data: CreateTransactionInput) => {
		const { category, description, price, type } = data;

		const response = await api.post("transactions", {
			category,
			description,
			price,
			type,
			createdAt: new Date(),
		});

		setTransactions((state) => [response.data, ...state]);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTransactions();
	}, []);

	return (
		<TransactionsContext.Provider
			value={{ transactions, createTransaction, fetchTransactions }}
		>
			{children}
		</TransactionsContext.Provider>
	);
}
