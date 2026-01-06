import { getCountries } from "@/app/_lib/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  const priorityNames = ["United States of America", "Canada"];
  const priorityCountries = priorityNames
    .map((name) => countries.find((country) => country.name === name))
    .filter(Boolean);
  const remainingCountries = countries.filter(
    (country) => !priorityNames.includes(country.name)
  );
  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {priorityCountries.map((c) => (
        <option
          key={c.name}
          value={`${c.name}%${c.flag}`}
        >
          {c.name}
        </option>
      ))}
      {priorityCountries.length > 0 && <option disabled>──────────</option>}
      {remainingCountries.map((c) => (
        <option
          key={c.name}
          value={`${c.name}%${c.flag}`}
        >
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
