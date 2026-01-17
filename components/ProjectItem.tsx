'use client';
import Link from 'next/link';

import { FaLocationArrow } from 'react-icons/fa6';
import Image from 'next/image';
import { Project } from '@/lib/models/ProjectModel';
import Button from './ui/Button';

import { Meteors } from './ui/Meteors';

export default function ProjectItem({ project }: { project: Project; }) {
  return (
    <div
      key={project._id}
      className="w-full h-full flex justify-center items-center"
    >
      <div className="group h-full w-full relative group">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <Image
            src={project.img}
            width={400}
            height={400}
            alt="ProjectImage"
            className="w-full h-full relative transition ease-in-out delay-150 duration-300 group-hover:scale-110"
          />
          <h1 className="font-bold mt-2 text-xl text-white mb-4 relative z-50">
            {project.title}
          </h1>

          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
            {project.des}
          </p>

          <div className="flex justify-between px-2 items-center w-full py-2">
            {/* tech icons */}
            <div className="flex justify-center items-center">
              {project.iconLists.map((icon: any, i: number) => (
                <div
                  key={i}
                  className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                  style={{
                    transform: `translateX(-${5 * i + 2}px)`,
                  }}
                >
                  <Image src={icon} height={70} width={70} alt="icon5" className="bg-white/30 rounded-full p-0.5" />
                </div>
              ))}
            </div>

            <Link href={project.link} target='_blank' className="z-50">
              <Button
                title="View live"
                position="right"
                icon={<FaLocationArrow />}
              />
            </Link>
          </div>

          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
