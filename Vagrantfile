# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    config.vm.box = "Official Ubuntu 12.04 daily Cloud Image amd64 (VirtualBox 4.1.12)"
    config.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/precise/current/precise-server-cloudimg-amd64-vagrant-disk1.box"
    config.vm.provision :shell, :path => "vagrant_bootstrap.sh"
end