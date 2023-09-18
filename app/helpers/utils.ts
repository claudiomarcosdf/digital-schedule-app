function formatCurrency(value: number) {
	return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(value: number) {
	return value.toLocaleString('pt-BR', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
}

function formatBrazil(value: number) {
	return value.toLocaleString('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

function formatDateBr(date: string) {
	if (!date) {
		return '';
	}

	const dateToFormat = date.substring(0, 10);
	const currentDate = new Date(dateToFormat);
	const dateFormated = new Intl.DateTimeFormat('pt-BR', {
		timeZone: 'UTC'
	}).format(currentDate);

	return dateFormated;
}

//Retorna primeira letra em Caixa alta
function capitalize(value: string) {
	const textLowerCase = value.toLowerCase();
	return textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1);
}

function capitalizeFullName(value: string) {
	var splitStr = value.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}


function formatCpfToView(value: string) {
  if (!value || value == '') return '';

	return ( 
		value.substring(0, 3) +
		'.' +
		value.substring(3, 6) +
		'.' +
		value.substring(6, 9) +
		'-' +
		value.substring(9, 11)
	);
}

function formatPhone(value: string) {
  if (!value || value == '') return ''; //6199763771

	if (value.length == 11) {
		return ( 
			'(' + value.substring(0, 2) +
			') ' +
			value.substring(2, 7) +
			'-' +
			value.substring(7, 11)
		);
	} else if (value.length == 10) {
		return ( 
			'(' + value.substring(0, 2) +
			') ' +
			value.substring(2, 6) +
			'-' +
			value.substring(6, 10)
		);
	}
}

function maskPhone(value: string) {
   if (!value || value == '') return '(99) 99999-9999';

	 value = value.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').replaceAll('-', '');

	 if (value.length == 11) return "(99) 99999-9999"
	 else if (value.length == 10) return "(99) 9999-9999"
 }

export { 	
  formatCurrency,
	formatNumber,
	formatBrazil,
	formatDateBr,
	capitalize,
	capitalizeFullName,
	formatCpfToView,
	formatPhone,
	maskPhone
}