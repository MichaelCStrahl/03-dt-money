import { type ReactNode, createContext, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transactions {
	id: number;
	description: string;
	price: number;
	type: "income" | "outcome";
	category: string;
	createdAt: string;
}

interface TransactionContextType {
	transactions: Transactions[];
	fetchTransactions: (query?: string) => Promise<void>;
}

interface TransactionsProviderProps {
	children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
	const [transactions, setTransactions] = useState<Transactions[]>([]);

	const fetchTransactions = async (query?: string) => {
		const response = await api.get("transactions", {
			params: {
				q: query,
			},
		});

		setTransactions(response.data);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTransactions();
	}, []);

	return (
		<TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
			{children}
		</TransactionsContext.Provider>
	);
}
