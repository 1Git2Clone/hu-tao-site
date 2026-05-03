import { redirect } from '@sveltejs/kit';

export const GET = ({ params }) => {
	redirect(308, `/blogs/${params.slug}`);
};
