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
}

interface TransactionsProviderProps {
	children: ReactNode;
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
	const [transactions, setTransactions] = useState<Transactions[]>([]);

	const loadTransactions = async () => {
		const response = await fetch("http://localhost:3000/transactions");
		const data = await response.json();

		setTransactions(data);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadTransactions();
	}, []);

	return (
		<TransactionsContext.Provider value={{ transactions }}>
			{children}
		</TransactionsContext.Provider>
	);
}
