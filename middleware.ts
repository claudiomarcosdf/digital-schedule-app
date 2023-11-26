import { NextResponse } from 'next/server'
import { withAuth, NextRequestWithAuth, NextAuthMiddlewareOptions } from "next-auth/middleware";
import { privateRoutes } from './layout/routes/privateRoutes'; 

const middleware = (request: NextRequestWithAuth) => {
   console.log('MIDDLEWARE_TOKEN '+JSON.stringify(request?.nextauth?.token))

  //  const requestHeaders = new Headers(request.headers)
  //  requestHeaders.set('Authorization', 'xxxx')

   const authorizedRoute = privateRoutes.routes.find((route) => route.path == request.nextUrl.pathname && route.role == request.nextauth.token?.role)

   console.log(authorizedRoute)
   //const isPrivateRoutes = request.nextUrl.pathname.startsWith('/relatorios/paciente')
   //const isAdminUser = request.nextauth.token?.role == 'admin'

   //if (isPrivateRoutes && !isAdminUser) {
    if (!authorizedRoute) {
    return NextResponse.rewrite(new URL('/auth/access', request.url))
   }
   NextResponse.next();
}

 const callbackOptions: NextAuthMiddlewareOptions = {
    // callbacks: {
    //   authorized: ({ token }) => token?.role === "admin",
    // } 
 }

export default withAuth(middleware, callbackOptions)


// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token)
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "admin",
//     },
//   }
// )

const allPrivateRoutes = privateRoutes.routes.map(route => route.path);

export const config = {
   matcher: [
    '/paginas/profissional',
    '/paginas/paciente',
    '/paginas/procedimento',
    '/relatorios/paciente'
  ]
  //matcher: ["/relatorios/paciente"]
  //matcher: ["/((?!auth|_next/static|_next/image|favicon.ico|register|api|login|error).*)"]
}