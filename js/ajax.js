var chave_aplicacao = "7a7134e1-dfc3-4922-b145-eb8b605171aa";
var token = "?chave_api=" + $.cookie('chave_api') + "&chave_aplicacao=" + chave_aplicacao;

$(document).ready(function(){
    if(!$.cookie('chave_api')) {
        location.href = "index.html";
    }
    /* Listagem de Produtos */
    if($('.listagem-produtos').length) {
        $.ajax({
            type: 'GET',
            url: "http://api.lojaintegrada.com.br/api/v1/produto" + token,
            dataType: "jsonp",
            cache: false,
            crossDomain: true,
            processData: true,
            error: function(e) {
                //alert("Ocorreu um erro, tente novamente.");
                console.log(e);
            },
            success: function(data) {
                var tr;
                jQuery.each(data.objects, function(i, e) {
                    tr = "<tr><td>" + e.id + "</td><td>" + e.nome + "</td><td>" + e.sku + "</td><td class='text-center'><a class='btn btn-info btn-xs' href='produto.html#" + e.id + "'><span class='glyphicon glyphicon-edit'></span> Editar</a></td></tr>";
                    $('.listagem-produtos tbody').append(tr);
                });
            }
        });
    }
    
    /* Edição de Produto */
    var id = location.hash;
    id = id.replace("#", "");
    if($('.produto').length) {
        if(id) {
            $.ajax({
                type: 'GET',
                url: "http://api.lojaintegrada.com.br/api/v1/produto/" + id + token + "&descricao_completa=1",
                dataType: "jsonp",
                cache: false,
                crossDomain: true,
                processData: true,
                error: function(e) {
                    location.hash = "";
                },
                success: function(data) {
                    $('#nome').val(data.nome);
                    $('#sku').val(data.sku);
                    $('h1 small').text(data.id);
                    obter_descricao(data.descricao_completa);
                }
            });
        }
    };
    $("#edit-prod").submit(function(event) {
        var dados = {
            'nome': $('#nome').val(),
            'sku': $('#sku').val(),
            'descricao_completa': gerar_descricao(),
            'chave_api': $.cookie('chave_api'),
            'chave_aplicacao': chave_aplicacao
        }
        var metod = (id != "") ? "PUT" : "POST";
        var prod_id = (id != "") ? id + token : token;
        $.ajax({
            type: "POST",
            url: "send.php",
            data: {
                'data': dados,
                'metod': metod,
                'id': prod_id
            },
            dataType: "json",
            crossDomain: true,
            error: function(e) {
                alert("Ocorreu um erro, tente novamente.");
                console.log(e);
            },
            success: function(data) {
                console.log(data);
                if (data.id) {
                    location.hash = data.id;
                } else if(data.response.id) {
                    location.hash = data.response.id;
                }
                alert('Produto salvo com sucesso!');
            }
        });
        event.preventDefault();
    });
});

function gerar_descricao() {
    var table = "<style type='text/css'>#descricao #descr-custom + table { margin-top: 20px; width: 100%; } #descricao table td, #descricao table th { padding: 5px 10px; text-align: left; }</style><div id='descr-custom'>" + $('#descr').val() + "</div>";
    var tr, tem_ativo;
    $('.tab-content .tab-pane.custom').each(function(i) {
        table += "<table id='" + $(this).attr('id') + "'>";
        $(this).find('.form-group').each(function(i2) {
            tr = "";
            if($(this).hasClass('cb')) {
                tr = "<tr><th>" + $(this).find('label.control-label').text() + "</th><td>";
                tem_ativo = 0;
                $(this).find('.checkbox-inline').each(function(i3) {
                    if($(this).find('input').is(':checked')) {
                        if(tem_ativo) { tr += ", "; };
                        tem_ativo = 1;
                        tr += $(this).text().replace(/\s+/g, ' ').slice(1, -1);
                    };
                });
                if(tem_ativo) {
                    tr += "</td></tr>";
                } else {
                    tr = "";
                }
            } else if($(this).find('option:selected').text() != "") {
                tr = "<tr><th>" + $(this).find('label').text() + "</th><td>" + $(this).find('option:selected').text() + "</td></tr>"
            } else if($(this).find('input[type=text]').val() && $(this).find('input[type=text]').val() != "") {
                tr = "<tr><th>" + $(this).find('label').text() + "</th><td>" + $(this).find('input').val() + "</td></tr>"
            };
            table += tr;
        });
        table += "</table>";
    });
    return table;
};

function obter_descricao(data) {
    var input, string;
    var tratamento = $("<div id='NEW'>" + data + "</div>");
    var table_veiculos = $(tratamento).find('#veiculos');
    var table_imoveis = $(tratamento).find('#imoveis');
    var descr_custom = $(tratamento).find('#descr-custom').html();
    $(tratamento).find('style').remove();
    $(tratamento).find('#veiculos').remove();
    $(tratamento).find('#imoveis').remove();
    $(tratamento).find('#descr-custom').remove();
    $('#descr').val(descr_custom.replace(/\s+/g, ' '));
    if(table_veiculos) {
        tratar_descricao(table_veiculos);
    };
    if(table_imoveis) {
        tratar_descricao(table_imoveis);
    };
};

function tratar_descricao(data) {
    $(data).find('tr').each(function(i) {
        input = $(".form-group:contains('" +  $(this).find('th').text() + "')").find('.col-sm-10');
        if ($(input).parent().hasClass('cb')) {
            string = $(this).find('td').text().split(", ");
            jQuery.each(string, function(i, e) {
                $(input).find(".checkbox-inline:contains('" + e + "')").find('input').prop("checked", true);
            });
        } else if($(input).find('select').is('select')) {
            $(input).find("option:contains('" + $(this).find('td').text() + "')").attr('selected','selected');
        } else if($(input).find('input[type=text]')) {
            $(input).find('input[type=text]').val($(this).find('td').text());
        };
    });
};





