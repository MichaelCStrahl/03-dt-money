import { type ReactNode, useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transactions {
	id: number;
	description: string;
	type: "income" | "outcome";
	price: number;
	category: string;
	createdAt: string;
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

	const fetchTransactions = useCallback(async (query?: string) => {
		const response = await api.get("transactions", {
			params: {
				_sort: "createdAt",
				_order: "desc",
				q: query,
			},
		});

		setTransactions(response.data);
	}, []);

	const createTransaction = useCallback(
		async (data: CreateTransactionInput) => {
			const { category, description, price, type } = data;

			const response = await api.post("transactions", {
				category,
				description,
				price,
				type,
				createdAt: new Date(),
			});

			setTransactions((state) => [response.data, ...state]);
		},
		[],
	);

	useEffect(() => {
		fetchTransactions();
	}, [fetchTransactions]);

	return (
		<TransactionsContext.Provider
			value={{ transactions, createTransaction, fetchTransactions }}
		>
			{children}
		</TransactionsContext.Provider>
	);
}
