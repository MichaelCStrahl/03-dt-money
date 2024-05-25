import { type ReactNode, createContext, useEffect, useState } from "react";

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
		const url = new URL("http://localhost:3333/transactions");

		if (query) {
			url.searchParams.append("q", query);
		}

		const response = await fetch(url);
		const data = await response.json();

		setTransactions(data);
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
