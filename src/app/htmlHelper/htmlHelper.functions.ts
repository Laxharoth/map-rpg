export function getInputs():{input:string,select:string}
{
  const input:any = document.getElementById('unique-input');
  const inputValue = input?.value||'';
  const select:any = document.getElementById('unique-select')
  const selectValue = select?.value||null;
  return {input:inputValue, select:selectValue};
}
