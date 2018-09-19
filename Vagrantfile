# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "CentosBox/Centos-7-v7.4-Web-Server-CLI-Apache2.4-PHP7"

  # config.vm.network "forwarded_port", guest: 80, host: 8080
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"
  # config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network"
  config.vm.network "forwarded_port", guest: 3306, host: 3306
  config.vm.network "forwarded_port", guest: 80, host: 8080


  # config.vm.synced_folder "../data", "/vagrant_data"

  config.vm.provision "shell", inline: <<-SHELL
    sudo systemctl disable firewalld.service
    sudo systemctl stop firewalld.service
    sudo sed -i 's/#bind-address.*/bind-address=0.0.0.0/g' /etc/my.cnf.d/server.cnf
    mysql -uroot -e "CREATE USER ''@'%' IDENTIFIED BY '';"
    mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO ''@'%';"
    mysql -uroot -e "FLUSH PRIVILEGES;"
    sudo systemctl restart mysqld.service
    mysql -uroot < /vagrant/sql/schema.sql
  SHELL
end
