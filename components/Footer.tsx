import { FaLocationArrow } from 'react-icons/fa6';

import { socialMedia } from '@/data';
import Button from './ui/Button';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full relative pt-20 pb-10 bg-slate-950" id="contact">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl text-center font-bold lg:max-w-[60vw]">
          The performance optimizations in Next.js aren&apos;t just features
          they&apos;re a philosophy of creating the fastest, most{' '}
          <span className="text-blue-400">responsive</span> web experiences
          possible.
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:rpancholi522@gmail.com">
          <Button
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-2 mx-2">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright &copy; {new Date().getFullYear()} {" "} Rajendra Pancholi
        </p>
        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <Link
              href={info.link}
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg hover:text-blue-500 hover:scale-105 transition-all"
            >
              <img src={info.img} alt="icons" width={20} height={20} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
