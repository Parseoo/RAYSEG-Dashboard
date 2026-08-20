import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TypeSelect = () => {
  return (
    <Select >
    <SelectTrigger className='w-[180px]'>
      <SelectValue placeholder='Type' />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value='ForSale'>For Sale</SelectItem>
      <SelectItem value='ForRent'>For Rent</SelectItem>
    </SelectContent>
    </Select>
  )
}

export const StatusSelect = () => {
    return (
        <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Any Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='AnyStatus'>Any Status</SelectItem>
          <SelectItem value='ForSale'>For Sale</SelectItem>
          <SelectItem value='ForRent'>For Rent</SelectItem>
        </SelectContent>
      </Select>
    )
  }