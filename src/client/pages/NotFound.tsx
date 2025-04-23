export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-base-100 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-base-content">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl text-base-content">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-base-content/40 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="btn btn-md btn-success"
          >
            Go back home
          </a>
          <a href="#" className="text-sm font-semibold text-base-content">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
