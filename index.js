var cheerio = require('cheerio');

module.exports = {

  website: {
    assets: "./assets",
    js: [
      "sectionx.js"
    ],
    css: [
      "sectionx.css"
    ]
  },

  hooks: {

    "page": function (page) {
      var content = page.content,
        match = content.match(/<!--\s*sec[\s\S]+?ces\s*-->[\s\S]+?<!--\s*endsec\s*-->/g),
        idList = [];

        
      var customTag = this.config.get("pluginsConfig").sectionx.tag || 'h2';

      if (!customTag.match(/^(h[1-6]|b)$/)) {
        customTag = 'h2';
      }

      if (match) {

        var error = [];

        match.forEach(function (item, i) {

          var header = item.match(/<!--\s*sec[\s\S]+?ces\s*-->/)[0],
            body = item.replace(/<!--\s*sec[\s\S]+?ces\s*-->/, '').replace(/<!--\s*endsec\s*-->/, ''),
            id = header.match(/data-id\s*=\s*"[\w\d]+?"\s/);

         
          if (/<!--\s*sec/.test(body)) //contain nested sections
            // error.push([header, 'Nested sections are not supported by this plugin.']);

          if (!header.match(/data-title\s*=\s*"[^"]+?"\s/)) //contain valid title
            // error.push([header, 'A valid title is missing.']);

          if (id) {
            id = id[0].match(/"[^"]+?"/)[0].replace(/"/g, '');
            if (idList.indexOf(id) >= 0)
              error.push([header, 'The id for the section is not unique.']);
            else
              idList.push(id);
          } else
            // error.push([header, 'A valid id is missing.']);

          if (header.match(/data-show\s*=\s*.+?\s/))
            if (!item.match(/data-show\s*=\s*true\s/) && !item.match(/data-show\s*=\s*false\s/))
              error.push([header, 'Attribute "data-show" is set to invalid value.']);

          if (header.match(/data-collapse\s*=\s*.+?\s/))
            if (!item.match(/data-collapse\s*=\s*true\s/) && !item.match(/data-collapse\s*=\s*false\s/))
              error.push([header, 'Attribute "data-collapse" is set to invalid value.']);

          content = content.replace(/<!--\s*sec\s/g, '<sec ')
            .replace(/\sces\s*-->/g, '>')
            .replace(/<!--\s*endsec\s*-->/g, '</sec>').replace(/<!--\s*raw\s*-->/, '<div class="v2uidemo v2ui-demo-code-block">').replace(/<!--\s*endraw\s*-->/, '</div>').replace(/<!--\s*desc\s*-->/, '<div class="v2uidemo v2ui-demo-desc"><a><span class="fa fa-angle-down v2ui-fa" ></span></a>').replace(/<!--\s*enddesc\s*-->/, '</div>');

        });

        if (error.length > 0) {
          console.log('[gitbook-plugin-sectionx](' + page.path + ')n');

          error.forEach(function (item) {
            console.log('Error: ' + item[1] + ' Please fix the syntax for the following section:');
            console.log(item[0] + '\n');
          });

          page.content = '<p class="alert alert-danger">TO AUTHOR: There exists some syntax error in this page, check the build log for details.</p>';

        } else {

          var $ = cheerio.load(content);

          if (this.output.name === 'website') {

            $('sec').each(function () {

              var html = $(this).html();
              var title = $(this).data('title') ? $(this).data('title').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
              var dataTitle = $(this).data('title') ? $(this).data('title') : '';
              var dataId = $(this).data('id') ? $(this).data('id') : ''
              var rawStr = $(this).find('.v2ui-demo-code-block');
              $(this).html(
                '<div class="panel panel-default">' +
                // '<a><span class="fa fa-angle-up v2ui-fa" ></span></a>' +
                (dataTitle ?  '<div class="panel-heading"><' + customTag + '>' + dataTitle + '<a class="pull-right section atTitle btn btn-default" target=' + dataId + '></a></' + customTag + '></div>' : '') +
                '<div class="panel-collapse" id="' + dataId + '">' +
                '<div class="panel-body">' + html + '</div>' + 
                '</div>' + 
                '</div>');

              if ($(this).data('show') === false)
                $(this).find('.panel').addClass('hidden');
              else
                $(this).find('.panel-collapse').addClass('in');
            });
          } else
            $('sec').each(function () {
              if ($(this).data('nopdf'))
                $(this).remove();
              else {
                var title = $(this).data('title') ? $(this).data('title').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
                $(this).prepend('<' + customTag + '>' + $(this).data('title') + '</' + customTag + '>');
              }
            });

          page.content = $.html();
        }
      }
      return page;
    }
  }
};
