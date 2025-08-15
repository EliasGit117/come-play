import { FC, SVGProps } from 'react';


export interface IOption {
  label: string;
  value: string;
  count?: number;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export enum SearchInputType {
  Text = 'text',
  Number = 'number',
  NumberRange = 'number-range',
  Date = 'date',
  DateRange = 'date-range',
  Select = 'select',
  MultiSelect = 'multi-select',
}

export interface ISelectOption {
  value: string | number | boolean;
  label: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}


interface IBaseSearchConfig {
  placeholder?: string;
  key: string;
}

interface ITextSearchConfig extends IBaseSearchConfig {
  type: SearchInputType.Text;
  maxLength?: number;
}

interface INumberSearchConfig extends IBaseSearchConfig {
  type: SearchInputType.Number;
  min?: number;
  max?: number;
}

interface INumberRangeSearchConfig extends IBaseSearchConfig {
  type: SearchInputType.NumberRange;
  range: [number, number];
  unit?: string;
}

interface ISelectSearchConfig extends IBaseSearchConfig {
  type: SearchInputType.Select;
  options: ISelectOption[];
}

interface IMultiSelectSearchConfig extends IBaseSearchConfig {
  type: SearchInputType.MultiSelect;
  options: ISelectOption[];
}

interface IDateRangeSearchConfig extends IBaseSearchConfig {
  type: SearchInputType.DateRange;
}

export type ISearchConfig =
  ITextSearchConfig |
  INumberRangeSearchConfig |
  INumberSearchConfig |
  ISelectSearchConfig |
  IMultiSelectSearchConfig |
  IDateRangeSearchConfig;


