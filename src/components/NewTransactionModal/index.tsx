import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import { Controller, useForm } from "react-hook-form";
import { useContextSelector } from "use-context-selector";
import { z } from "zod";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import {
	CloseButton,
	Content,
	Overlay,
	TransactionType,
	TransactionTypeButton,
} from "./styles";

const newTransactionModalSchema = z.object({
	description: z.string(),
	price: z.number(),
	category: z.string(),
	type: z.enum(["income", "outcome"]),
});

type NewTransactionModalInputs = z.infer<typeof newTransactionModalSchema>;

export function NewTransactionModal() {
	const createTransaction = useContextSelector(
		TransactionsContext,
		(context) => {
			return context.createTransaction;
		},
	);
	const {
		reset,
		control,
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<NewTransactionModalInputs>({
		resolver: zodResolver(newTransactionModalSchema),
		defaultValues: {
			type: "income",
		},
	});

	const handleCreateNewTransaction = async (
		data: NewTransactionModalInputs,
	) => {
		const { category, description, price, type } = data;
		await createTransaction({ category, description, price, type });

		reset();
	};

	return (
		<Dialog.Portal>
			<Overlay />
			<Content>
				<Dialog.Title>Nova transação</Dialog.Title>
				<CloseButton>
					<X size={24} />
				</CloseButton>

				<form action="" onSubmit={handleSubmit(handleCreateNewTransaction)}>
					<input
						{...register("description")}
						type="text"
						placeholder="Descrição"
						required
					/>
					<input
						{...register("price", { valueAsNumber: true })}
						type="number"
						placeholder="Preço"
						required
					/>
					<input
						{...register("category")}
						type="text"
						placeholder="Categoria"
						required
					/>

					<Controller
						control={control}
						name="type"
						render={({ field }) => {
							return (
								<TransactionType
									onValueChange={field.onChange}
									value={field.value}
								>
									<TransactionTypeButton value="income" variant="income">
										<ArrowCircleUp size={24} />
										Entrada
									</TransactionTypeButton>
									<TransactionTypeButton value="outcome" variant="outcome">
										<ArrowCircleDown size={24} />
										Saída
									</TransactionTypeButton>
								</TransactionType>
							);
						}}
					/>

					<button type="submit" disabled={isSubmitting}>
						Cadastrar
					</button>
				</form>
			</Content>
		</Dialog.Portal>
	);
}
