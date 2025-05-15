// import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '@/prisma/prismaClient';
// import { authOptions } from '../auth/[...nextauth]/options';
// import { parse } from 'cookie';
// import { getServerSession } from 'next-auth';

// export default async function GET(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const session = await getServerSession(req, res, authOptions);

//     let preferences: string[] = [];

//     if (session?.user?.email) {
//       const user = await prisma.user.findUnique({
//         where: { email: session.user.email },
//         select: { preferences: true }
//       });
//       preferences = user?.preferences || [];
//     }

//     if (preferences.length === 0) {
//       const cookies = parse(req.headers.cookie || '');
//       const cookiePref = cookies['preferences'];
//       if (cookiePref) {
//         preferences = JSON.parse(cookiePref); 
//       }
//     }

//     if (preferences.length === 0) {
//       return res.status(400).json({ message: 'No preferences found for recommendation.' });
//     }

//     const keywords = preferences.map(p => p.toLowerCase());

//     const businesses = await prisma.business.findMany({
//       where: {
//         OR: [
//           {
//             tags: {
//               hasSome: preferences
//             }
//           },
//           {
//             name: {
//               contains: keywords.join(' '),
//               mode: 'insensitive'
//             }
//           },
//           {
//             description: {
//               contains: keywords.join(' '),
//               mode: 'insensitive'
//             }
//           }
//         ]
//       },
//       take: 10,
//       orderBy: {
//         updatedAt: 'desc'
//       }
//     });

//     res.status(200).json({ recommendations: businesses });
//   } catch (err) {
//     console.error('[RECOMMENDATION_ERROR]', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }
