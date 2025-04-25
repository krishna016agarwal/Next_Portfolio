import { MdOutlineMenu } from "react-icons/md";
export default function Navbar() {
    return (
      <div className="h-20 flex justify-between  items-center ml-10 fixed top-0 left-0 w-full  shadow-md z-50  p-12!">
        <div className="text-white text-2xl font-extrabold ">
          Port<span className="text-gray-400">folio.</span>
        </div>
        <div className=" w-14 h-14 rounded-full border-1! border-white bg-gray-800 flex items-center justify-center hover:bg-white hover:text-black duration-100 ease-in">
        <MdOutlineMenu className="text-[1.5vw]!" />
     
        </div>
        
      </div>
    );
  }
  