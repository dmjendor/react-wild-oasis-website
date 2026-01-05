import noStore from "next/cache";
import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";

async function CabinList() {
  noStore();
  const cabins = await getCabins();

  if (!cabins.length) return null;
  return (
    <>
      {cabins.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
          {cabins.map((cabin) => (
            <CabinCard
              cabin={cabin}
              key={cabin.id}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CabinList;
