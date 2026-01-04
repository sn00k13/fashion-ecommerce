// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { productsApi } from '@/lib/api';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const category = searchParams.get('category') || undefined;
	const limit = Number(searchParams.get('limit')) || 20;
	//   const offset = Number(searchParams.get('offset')) || 0;

	try {
		const { data, error } = await productsApi.getProducts(
			category,
			limit,
			null
		);

		if (error) {
			return NextResponse.json({ error: error }, { status: 500 });
		}

		return NextResponse.json({ data });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred';
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
