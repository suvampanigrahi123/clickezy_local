import Image from 'next/image';
import Link from 'next/link';

function Error({ statusCode }) {
  return (
    <div className="error-container">
      <Image
        src="https://rickandmortyapi.com/api/character/avatar/234.jpeg"
        alt="a dead morty..."
      />
      {statusCode && <h1>Error: {statusCode}</h1>}
      <p>We are sorry! There was an error</p>
      <Link href="/">Go back home</Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
