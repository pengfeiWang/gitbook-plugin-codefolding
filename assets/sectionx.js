require(["gitbook", "jquery"], function (gitbook, $) {

  var sectionToggle = function (tar, button) {
    // var $target = $('#' + tar);
    // $target.collapse('toggle');
    // if (button)
    //   $target.parents('.panel').toggle('slow');
  };

  var clickAction = function ($source, tar) {
    // $source.click(function () {
    //   sectionToggle(tar, !$(this).hasClass('atTitle'));
    //   if (!$(this).hasClass('atTitle'))
    //     $(this).toggleClass('btn-info').toggleClass('btn-success');
    // });

    // $('#' + tar).on('show.bs.collapse', function () {
    //   $source.html($source.attr('hide') ?
    //     ('<b>' + $source.attr('hide') + '</b><span class="fa fa-angle-up pull-left"/>') :
    //     '<span class="fa fa-angle-up"/>');
    // });

    // $('#' + tar).on('hide.bs.collapse', function () {
    //   $source.html($source.attr('show') ?
    //     ('<b>' + $source.attr('show') + '</b><span class="fa fa-angle-down pull-left"/>') : '<span class="fa fa-angle-down"/>');
    // });
  };

  gitbook.events.bind("page.change", function () {
    var sec = document.querySelectorAll('sec');
    for(var i = 0, len = sec.length; i < len; i++) {
      (function (k) {
        var n = sec[k];
        var btn = n.querySelector('.v2ui-fa');
        if(!btn) return;
        var codeBlock = n.querySelector('.v2ui-demo-code-block');
        var arr = ['fa-angle-up', 'fa-angle-down']
        btn.addEventListener('click', function (e) {
          if( btn.classList.contains(arr[1]) ) {
            codeBlock.style.display = 'block';
            btn.classList.remove(arr[1]);
            btn.classList.add(arr[0])
          } else {
            codeBlock.style.display = 'none';
            btn.classList.add(arr[1]);
            btn.classList.remove(arr[0])
          }
        });
      }(i));
    }
    // $('sec').each(function () {
    //   if ($(this).find('.panel').hasClass('hidden'))
    //     $(this).find('.panel').removeClass('hidden').hide();
    //   if ($(this).data('collapse') === true) {
    //     $('#' + $(this).data('id')).collapse('hide');
    //   }
    //   //.collapse('toggle');
    // });

    // $('.section').each(function () {
    //   clickAction($(this), $(this).attr('target'));
    //   if (!$(this).hasClass('atTitle')) {
    //     $(this).addClass('btn btn-info');
    //     $(this).html($(this).attr('show') ?
    //       ('<b>' + $(this).attr('show') + '</b><span class="fa fa-angle-down pull-left"/>') :
    //       '<span class="fa fa-angle-down"/>');
    //   }
    // });
  });
});
